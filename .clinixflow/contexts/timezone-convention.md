# Convenção de Timezone — ClinixFlow Legacy

## Regra Fundamental

**Todos os horários são armazenados em UTC no banco de dados.**
A conversão para o timezone local (BRT = UTC-3 = `America/Sao_Paulo`) acontece sempre na camada de aplicação, nunca no banco.

---

## Por que UTC?

- O banco não armazena offset junto com os valores `time without time zone` e `timestamp without time zone` — ele armazena o valor bruto.
- Guardar em UTC garante que, no futuro, o sistema possa suportar clínicas em outros países/fusos sem precisar migrar dados.
- Evita ambiguidades no horário de verão (Dayjs + plugin `timezone` lida com isso automaticamente ao converter).

---

## Colunas Afetadas

### Tabela `doctor_availability`
| Coluna | Tipo | O que representa |
|---|---|---|
| `start_time` | `time without time zone` | Horário de início da disponibilidade em **UTC** |
| `end_time` | `time without time zone` | Horário de fim da disponibilidade em **UTC** |

**Exemplo real verificado (2026-03-29):**
```
JAMILY NUNES LISBOA — inicio_utc: 16:30 / fim_utc: 22:30
                     → inicio_brt: 13:30 / fim_brt: 19:30  ✅
```

### Tabela `appointments`
| Coluna | Tipo | O que representa |
|---|---|---|
| `date` | `timestamp without time zone` | Data/hora do agendamento em **UTC** |

---

## Funções de Conversão (`src/lib/timezone.ts`)

```typescript
// BRT → UTC (usar ao SALVAR no banco)
localTimeToUTC(timeString: string): string
// Ex: "13:30" (BRT) → "16:30" (UTC)

// UTC → BRT (usar ao LER do banco para exibição)
utcTimeToLocal(timeString: string): string
// Ex: "16:30" (UTC) → "13:30" (BRT)
```

### Para timestamps completos (`src/lib/date-utils.ts`)

```typescript
// Criar timestamp de agendamento: recebe data + hora BRT, retorna Date UTC
createLocalDateTime(dateString: string, timeString: string): Date
// Ex: "2025-12-31" + "14:00" → Date UTC (17:00 UTC)
```

---

## Fluxo ao Salvar Disponibilidade do Médico

```
Usuário digita 13:30 BRT
        ↓
localTimeToUTC("13:30") → "16:30"
        ↓
Salva "16:30" no banco (UTC)
```

## Fluxo ao Exibir Horários Disponíveis

```
Lê "16:30" do banco (UTC)
        ↓
utcTimeToLocal("16:30") → "13:30"
        ↓
dayjs.tz("2025-12-31 13:30", "America/Sao_Paulo")
        ↓
Gera slots de 10 em 10 min a partir das 13:30 BRT
```

---

## Armadilha Conhecida — Bug Corrigido

**Nunca usar `dayjs(date).set("hour", N)` no servidor.**

```typescript
// ❌ ERRADO — cria dayjs sem timezone. No Vercel (UTC), "08:00" vira 08:00 UTC
//    mas a intenção era 08:00 BRT (= 11:00 UTC). Causa offset de 3h nos slots.
const start = dayjs(parsedInput.date).set("hour", startHour);

// ✅ CORRETO — timezone explícito garante consistência local e Vercel
const start = dayjs.tz(`${parsedInput.date} ${startTimeLocal}`, "America/Sao_Paulo");
```

Este bug foi identificado e corrigido em `src/actions/get-available-times/index.ts`.

---

## Query de Verificação no Banco

Para checar se os horários estão corretos (mostra UTC e BRT lado a lado):

```sql
SELECT
  d.name AS profissional,
  da.day_of_week,
  da.start_time AS inicio_utc,
  da.end_time   AS fim_utc,
  (da.start_time - INTERVAL '3 hours')::time AS inicio_brt,
  (da.end_time   - INTERVAL '3 hours')::time AS fim_brt
FROM doctor_availability da
JOIN doctors d ON d.id = da.doctor_id
WHERE da.is_available = true
ORDER BY d.name, da.day_of_week;
```

Os valores `_brt` devem bater exatamente com os horários configurados no sistema.

---

## Impacto na Migração para o Sistema Novo (V2 / Supabase)

Ao migrar os dados do legacy para o novo sistema:

1. **`doctor_availability.start_time` / `end_time`** — valores já estão em UTC. Se o novo sistema também adotar UTC, copiar direto. Se o novo sistema adotar timezone-aware (`timetz` ou `timestamptz`), converter adicionando o offset `+00:00`.

2. **`appointments.date`** — timestamp já está em UTC. Migrar para `timestamptz` adicionando `AT TIME ZONE 'UTC'` na query de migração.

3. **Nunca subtrair 3h durante a migração** — os dados já estão corretos em UTC. Subtrair geraria dados errados (BRT no banco).

```sql
-- Exemplo de migração segura de timestamp para timestamptz
INSERT INTO new_appointments (date, ...)
SELECT date AT TIME ZONE 'UTC', ...
FROM legacy_appointments;
```
