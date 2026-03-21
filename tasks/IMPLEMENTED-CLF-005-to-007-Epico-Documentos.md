> **[IMPLEMENTED]** - Esta task já foi implementada/substituída.

# TICKET-005 ao TICKET-007: Épico Prontuários e Documentos

## TICKET-005: Prontuário Médico, Timeline de Notas e Imutabilidade LGPD
**User Story**: Como profissional da clínica, quero ter um ambiente cronológico com o relato dos meus atendimentos do paciente em Rich Text, que congele edições passadas (conformidade lei) após eu finalizá-las formalmente na sessão, mitigando perigos legais.
**Critérios de Aceite:**
- Aba de Evolução dentro do Card do Paciente mapeada de forma descendente (recente primeiro).
- Editor Rico que garanta Negrito, Listas e Formatação (ex: Tiptap / Quill).
- O profissional deve enviar a nota como rascunho. Mas se carimbada ("Finalizar"), não obedece mais atualizações em texto ou anexos atrelados ao bloco temporal respectivo.
**Refinamento Técnico:** A imutabilidade do `clinical_events` ocorrerá num **Postgres Trigger BEFORE UPDATE**. Se o status antigo do registro for `FINALIZED`, a transação quebra via `RAISE EXCEPTION`. Isso barra edições via API Key ou Hacks. Layout em `<Timeline />` (Componente de UI contendo pontos nodais com linha conectora).

## TICKET-006: Gestão de Arquivos, Laudos e Anexos Isolados 
**User Story**: Como profissional da saúde ou recepcionista, desejo anexar PDFs, Raios-X e JPEGs relevantes para cada apontamento textual no prontuário do paciente, guardando os exames pregressivos num acervo digital.
**Critérios de Aceite:**
- Drag'and'Drop nativo associando o arquivo enviado à respectiva nota de "Evolução" recém redigida.
- O sistema exibirá Thumbnails para preview (quando imagem).
- Os arquivos antigos só poderão ser visualizados ou desvinculados por gente autorizada, respeitando a linha mestra da imutabilidade (Se a nota foi carimbada, os logs atrelados cimentam-se lá).
**Refinamento Técnico:** O `Supabase Storage` proverá a ponte técnica: envios baseados em Buckets segmentados como `patient_docs / {tenantId} / {patientId} / {uuid.ext}`. As SignedURLs expiram rápidmente. Row Policies das tabelas impedirão Soft e Hard Deletion nos records atrelados ao Prontuário pós-fechação.

## TICKET-007: Geração de Atestados e Prescrições via Documentos Snapshot (PDF)
**User Story**: Como Doutor, desejo que minha prescrição medicamentosa descrita na minha receita textual via editor web possa ser exportada para imprimir com a arte vetorial logo/timbrado da minha clínica diretamente.
**Critérios de Aceite:**
- Ferramenta com Variáveis base ex: `{NomePaciente}`, inserindo a ficha limpa num layout Timbrado (Cabeçalho da clínica + Rodapé).
- O arquivo deve dar Preview na Tela Web e cuspir um Download em PDF formatado ou permitir mandar para impressora (Ctrl+P sem poluição do navegador ao redor).
- O Documento impresso congela seu raw-HTML como prova real emitido historicamente no BD, para coibir fraudes.
**Refinamento Técnico:** Substituição de Template-Strings dentro de HTML do backend/frontend, processadas reativamente. Biblioteca `@react-pdf/renderer` para processamento 100% Client-Side de Layouts complexos na pipeline React, e salvamento do Snapshot Blob convertido do String renderizado dentro da Storage anexada.
