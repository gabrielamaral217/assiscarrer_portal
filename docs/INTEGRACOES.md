# Integrações Google — guia de configuração

Todas as credenciais vão em `.env.local` (e nas variáveis de ambiente da Vercel ao
publicar). Depois de preencher, reinicie o `npm run dev`.

## 1. Google Analytics 4 (módulo Analytics)

1. Acesse https://console.cloud.google.com → crie/selecione um projeto.
2. **APIs e serviços → Biblioteca →** ative **Google Analytics Data API**.
3. **APIs e serviços → Credenciais → Criar credenciais → Conta de serviço**.
   Crie a conta e gere uma **chave JSON** (baixa um arquivo `.json`).
4. No GA4: **Admin → Acesso à propriedade → +** → adicione o e-mail da conta de
   serviço (algo como `nome@projeto.iam.gserviceaccount.com`) com papel **Leitor**.
5. Pegue o **ID numérico da propriedade** em **Admin → Detalhes da propriedade**.
6. Converta o JSON em base64:
   ```bash
   base64 -i caminho/chave.json | tr -d '\n'
   ```
7. No `.env.local`:
   ```
   GA4_PROPERTY_ID=123456789
   GOOGLE_SERVICE_ACCOUNT_B64=<conteúdo base64>
   ```

## 2. Google Ads (módulo Analytics)

1. No Google Ads: **Ferramentas → Configurações → API Center** → solicite um
   **developer token** (aprovação pode levar alguns dias).
2. No Google Cloud (mesmo projeto): **Credenciais → Criar credenciais → ID do
   cliente OAuth** (tipo "App para computador"). Guarde **client ID** e **secret**.
3. Gere um **refresh token** autorizando o escopo
   `https://www.googleapis.com/auth/adwords` (via OAuth Playground ou script).
4. Pegue o **customer ID** da conta (formato `123-456-7890`). Se usa conta MCC,
   informe também o ID da MCC.
5. No `.env.local`:
   ```
   GOOGLE_ADS_DEVELOPER_TOKEN=...
   GOOGLE_ADS_CUSTOMER_ID=1234567890
   GOOGLE_ADS_LOGIN_CUSTOMER_ID=  # só se houver MCC
   GOOGLE_CLIENT_ID=...
   GOOGLE_CLIENT_SECRET=...
   GOOGLE_REFRESH_TOKEN=...
   ```

## 3. Google Drive (módulo Drive — navegador de arquivos)

Reutiliza o mesmo client OAuth do Ads. Ao gerar o refresh token, inclua também o
escopo `https://www.googleapis.com/auth/drive.readonly`. As variáveis
`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` e `GOOGLE_REFRESH_TOKEN` já cobrem o Drive.

> O vínculo de pasta por projeto (campo "Pasta no Google Drive" na Área de trabalho)
> **já funciona sem credenciais** — é só colar o link da pasta.

## 4. WhatsApp (fase futura)

Definir provedor (Meta Cloud API oficial ou Evolution/Z-API) e preencher as variáveis
correspondentes. A tela e a estrutura já estão prontas.
