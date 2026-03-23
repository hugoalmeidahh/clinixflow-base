import * as fs from "fs";
import * as path from "path";

interface PatientRow {
  paciente: string;
  origem: string;
  dataNascimento: string;
  responsavel: string;
  tratamento: string;
  endereco: string;
  contato: string;
  cid: string;
  carteirinha: string;
}

function escapeSQL(value: string | null | undefined): string {
  if (!value || value.trim() === "") {
    return "NULL";
  }
  // Escapar aspas simples
  const escaped = value.replace(/'/g, "''");
  return `'${escaped}'`;
}

function escapeSQLRequired(value: string | null | undefined): string {
  // Para campos obrigatórios, sempre retornar string vazia ao invés de NULL
  if (!value || value.trim() === "") {
    return "''";
  }
  // Escapar aspas simples
  const escaped = value.replace(/'/g, "''");
  return `'${escaped}'`;
}

function parseDate(dateStr: string | null | undefined): string | null {
  if (!dateStr || dateStr.trim() === "") {
    return null;
  }

  // Formatos esperados: "1/2/1950", "7/4/1956", "5/24/2007", "08/072019"
  const cleaned = dateStr.trim();
  
  // Tentar formato MM/DD/YYYY ou M/D/YYYY
  const parts = cleaned.split("/");
  if (parts.length === 3) {
    const month = parts[0].padStart(2, "0");
    const day = parts[1].padStart(2, "0");
    const year = parts[2];
    
    if (year.length === 4) {
      return `${year}-${month}-${day}`;
    }
  }
  
  // Tentar formato DDMMYYYY (ex: "08/072019")
  if (cleaned.length === 8 || cleaned.length === 9) {
    const cleaned2 = cleaned.replace(/\//g, "");
    if (cleaned2.length === 8) {
      const day = cleaned2.substring(0, 2);
      const month = cleaned2.substring(2, 4);
      const year = cleaned2.substring(4, 8);
      return `${year}-${month}-${day}`;
    }
  }
  
  return null;
}

function extractPhoneNumber(contato: string | null | undefined): string {
  if (!contato || contato.trim() === "") {
    return "(12) 00000-0000";
  }

  // Tentar extrair o primeiro número de telefone encontrado
  // Formato esperado: "Eliana 12991301689" ou "12 997738397"
  const phoneRegex = /(\d{2})\s*(\d{4,5})\s*-?\s*(\d{4})/;
  const match = contato.match(phoneRegex);
  
  if (match) {
    const ddd = match[1];
    const firstPart = match[2];
    const secondPart = match[3];
    
    if (firstPart.length === 4) {
      return `(${ddd}) ${firstPart}-${secondPart}`;
    } else {
      return `(${ddd}) ${firstPart.substring(0, 4)}-${firstPart.substring(4)}${secondPart}`;
    }
  }
  
  // Tentar formato sem DDD: "12991301689"
  const simpleMatch = contato.match(/(\d{10,11})/);
  if (simpleMatch) {
    const phone = simpleMatch[1];
    if (phone.length === 10) {
      return `(12) ${phone.substring(0, 4)}-${phone.substring(4)}`;
    } else if (phone.length === 11) {
      return `(12) ${phone.substring(0, 5)}-${phone.substring(5)}`;
    }
  }
  
  return "(12) 00000-0000";
}

function extractResponsiblePhone(contato: string | null | undefined): string {
  if (!contato || contato.trim() === "") {
    return "(12) 00000-0000";
  }
  
  // Pegar o primeiro telefone encontrado (geralmente é o do responsável)
  return extractPhoneNumber(contato);
}

function mapInsurance(origem: string | null | undefined): string {
  if (!origem || origem.trim() === "") {
    return "particular";
  }
  
  const origemLower = origem.toLowerCase();
  
  if (origemLower.includes("santa casa")) {
    return "santa_casa_saude";
  }
  if (origemLower.includes("bradesco")) {
    return "bradesco_saude";
  }
  if (origemLower.includes("porto")) {
    return "porto_seguro";
  }
  if (origemLower.includes("particular")) {
    return "particular";
  }
  
  return "outros";
}

function parseAddress(endereco: string | null | undefined): {
  address: string;
  number: string;
  complement: string;
  neighborhood: string;
} {
  if (!endereco || endereco.trim() === "") {
    return {
      address: "Endereço não informado",
      number: "0",
      complement: "",
      neighborhood: "Centro",
    };
  }

  // Tentar extrair número e complemento
  // Exemplos:
  // "R Manoel Alves de Oliveira,34 Pq California Jacarei"
  // "Praça Serra Formosa,83 apto 66 Jd Anhembi"
  // "Av Joao Vicente do Nascimento Netto, 196 Dom Bosco"
  
  const parts = endereco.split(",");
  const address = parts[0]?.trim() || "Endereço não informado";
  let number = "0";
  let complement = "";
  let neighborhood = "Centro";
  
  if (parts.length > 1) {
    const rest = parts.slice(1).join(",").trim();
    
    // Tentar extrair número
    const numberMatch = rest.match(/(\d+)/);
    if (numberMatch) {
      number = numberMatch[1];
      
      // Tentar extrair complemento (apto, casa, etc)
      const complementMatch = rest.match(/(apto|apartamento|casa|bloco|bl|sala)\s*(\w+)/i);
      if (complementMatch) {
        complement = complementMatch[0];
      }
      
      // Tentar extrair bairro (geralmente após o número)
      const neighborhoodMatch = rest.match(/(?:apto|apartamento|casa|bloco|bl|sala)\s*\w+\s*(.+)/i);
      if (neighborhoodMatch) {
        neighborhood = neighborhoodMatch[1].trim();
      } else {
        // Tentar pegar tudo após o número como bairro
        const afterNumber = rest.replace(/\d+/, "").trim();
        if (afterNumber) {
          neighborhood = afterNumber.split(/\s+/).slice(0, 3).join(" "); // Pegar até 3 palavras
        }
      }
    } else {
      // Se não tem número, tentar pegar como bairro
      neighborhood = rest.split(/\s+/).slice(0, 3).join(" ");
    }
  }
  
  return {
    address: address || "Endereço não informado",
    number: number || "0",
    complement: complement || "",
    neighborhood: neighborhood || "Centro",
  };
}

function generateRandomCPF(): string {
  // Gerar CPF aleatório (apenas para placeholder)
  const part1 = Math.floor(Math.random() * 900) + 100;
  const part2 = Math.floor(Math.random() * 900) + 100;
  const part3 = Math.floor(Math.random() * 900) + 100;
  const part4 = Math.floor(Math.random() * 90) + 10;
  return `${part1}.${part2}.${part3}-${part4}`;
}

function generateRandomRG(): string {
  // Gerar RG aleatório (apenas para placeholder)
  const part1 = Math.floor(Math.random() * 90) + 10;
  const part2 = Math.floor(Math.random() * 900) + 100;
  const part3 = Math.floor(Math.random() * 900) + 100;
  return `${part1}.${part2}.${part3}-${Math.floor(Math.random() * 9) + 1}`;
}

function inferSex(name: string): "male" | "female" {
  // Tentar inferir sexo pelo nome (não é 100% preciso, mas ajuda)
  const nameLower = name.toLowerCase();
  const femaleNames = ["maria", "ana", "beatriz", "lucia", "eliana", "erika", "lucy", "priscila", "simone", "amanda", "shirley", "evelyn", "valéria", "valeria", "larissa", "fabia", "tainara", "jessica", "rochele", "sonia", "miriam", "aline", "katia", "kátia"];
  const maleNames = ["akio", "jorge", "nathan", "enzo", "leo", "victor", "pedro", "benjamim", "heitor", "matheus", "levi", "joao", "henrique", "joaquim", "alexandro", "jonas", "carlos", "eduardo", "rafael", "tiago", "jeferson", "rodrigo"];
  
  const firstName = nameLower.split(" ")[0];
  
  if (femaleNames.some(n => firstName.includes(n))) {
    return "female";
  }
  if (maleNames.some(n => firstName.includes(n))) {
    return "male";
  }
  
  // Se não conseguir inferir, alternar entre male e female
  return Math.random() > 0.5 ? "male" : "female";
}

function generateEmail(name: string): string {
  if (!name || name.trim() === "") {
    return "paciente@email.com";
  }
  
  const normalized = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, ".")
    .substring(0, 50);
  
  return `${normalized}@paciente.com`;
}

function main() {
  const csvPath = path.join(
    process.env.HOME || "",
    "Downloads",
    "pacientes_PlenoSer_2025.xlsx - Planilha1.csv"
  );

  if (!fs.existsSync(csvPath)) {
    console.error(`Arquivo não encontrado: ${csvPath}`);
    process.exit(1);
  }

  const csvContent = fs.readFileSync(csvPath, "utf-8");
  const lines = csvContent.split("\n");

  // Pular as duas primeiras linhas (cabeçalho vazio e cabeçalho real)
  const dataLines = lines.slice(2);

  const patients: PatientRow[] = [];

  for (const line of dataLines) {
    if (!line.trim()) continue;

    // Parsear CSV manualmente (considerando aspas)
    const columns: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        columns.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    columns.push(current.trim());

    // Mapear colunas (índices baseados no cabeçalho)
    // ,Paciente,Origem,Data Nascimento,Responsavel,Trata/o,Endereço,Contato,CID,Carteirinha
    if (columns.length >= 9 && columns[1]?.trim()) {
      patients.push({
        paciente: columns[1]?.trim() || "",
        origem: columns[2]?.trim() || "",
        dataNascimento: columns[3]?.trim() || "",
        responsavel: columns[4]?.trim() || "",
        tratamento: columns[5]?.trim() || "",
        endereco: columns[6]?.trim() || "",
        contato: columns[7]?.trim() || "",
        cid: columns[8]?.trim() || "",
        carteirinha: columns[9]?.trim() || "",
      });
    }
  }

  console.log(`Processados ${patients.length} pacientes\n`);

  // Valores específicos da clínica
  const CLINIC_ID = "8c9e0546-7d24-4fdd-8b21-652d910da6b7";
  const CREATED_BY = "sV2MpnZI1Uyw1gjDUbXjYW6xTLwHI2ZI";

  // Gerar SQL
  let sql = `-- Script de inserção de pacientes
-- Clínica: ${CLINIC_ID}
-- Criado por: ${CREATED_BY}
-- NOTA: Alguns campos foram preenchidos com valores aleatórios/placeholder e devem ser ajustados manualmente

`;

  let patientRecordNumber = 1;

  for (let i = 0; i < patients.length; i++) {
    const p = patients[i];
    
    if (!p.paciente || p.paciente.trim() === "") {
      continue;
    }

    const patientCode = (i + 1).toString().padStart(3, "0");
    const birthDate = parseDate(p.dataNascimento) || "2000-01-01";
    const phoneNumber = extractPhoneNumber(p.contato);
    const responsibleContact = extractResponsiblePhone(p.contato);
    const insurance = mapInsurance(p.origem);
    const addressData = parseAddress(p.endereco);
    const sex = inferSex(p.paciente);
    const email = generateEmail(p.paciente);
    const cpf = generateRandomCPF();
    const rg = generateRandomRG();
    const responsibleName = p.responsavel || "Não informado";
    const motherName = p.responsavel || "Não informado";
    const fatherName = "Não informado";
    const insuranceCard = p.carteirinha || "000000000";
    const zipCode = "12200-000"; // CEP padrão de São José dos Campos
    const city = "São José dos Campos";
    const state = "SP";
    const cid = p.cid || null;

    sql += `INSERT INTO patients (
  name,
  email,
  patient_code,
  phone_number,
  is_whatsapp,
  sex,
  birth_date,
  mother_name,
  father_name,
  responsible_name,
  responsible_contact,
  insurance,
  insurance_card,
  cid,
  rg,
  cpf,
  zip_code,
  address,
  number,
  complement,
  neighborhood,
  city,
  state,
  is_active,
  patient_record_number,
  clinic_id,
  created_by,
  created_at,
  updated_at
) VALUES (
  ${escapeSQLRequired(p.paciente)},
  ${escapeSQLRequired(email)},
  ${escapeSQLRequired(patientCode)},
  ${escapeSQLRequired(phoneNumber)},
  true,
  ${escapeSQLRequired(sex)},
  ${escapeSQLRequired(birthDate)},
  ${escapeSQLRequired(motherName)},
  ${escapeSQLRequired(fatherName)},
  ${escapeSQLRequired(responsibleName)},
  ${escapeSQLRequired(responsibleContact)},
  ${escapeSQL(insurance)},
  ${escapeSQLRequired(insuranceCard)},
  ${cid ? escapeSQL(cid) : "NULL"},
  ${escapeSQLRequired(rg)},
  ${escapeSQLRequired(cpf)},
  ${escapeSQLRequired(zipCode)},
  ${escapeSQLRequired(addressData.address)},
  ${escapeSQLRequired(addressData.number)},
  ${escapeSQLRequired(addressData.complement)},
  ${escapeSQLRequired(addressData.neighborhood)},
  ${escapeSQLRequired(city)},
  ${escapeSQLRequired(state)},
  true,
  ${patientRecordNumber},
  '${CLINIC_ID}',
  '${CREATED_BY}',
  NOW(),
  NOW()
);

`;

    patientRecordNumber++;
  }

  // Salvar SQL em arquivo
  const outputPath = path.join(
    process.cwd(),
    "scripts",
    "import-patients.sql"
  );
  
  fs.writeFileSync(outputPath, sql, "utf-8");
  
  console.log(`✅ SQL gerado com sucesso!`);
  console.log(`📁 Arquivo salvo em: ${outputPath}`);
  console.log(`\n⚠️  Lembre-se de:`);
  console.log(`   1. Revisar e ajustar valores aleatórios (CPF, RG, email, etc.)`);
  console.log(`   2. Verificar dados de endereço extraídos`);
  console.log(`   3. Confirmar telefones extraídos corretamente`);
  console.log(`   4. Verificar datas de nascimento`);
}

main();
