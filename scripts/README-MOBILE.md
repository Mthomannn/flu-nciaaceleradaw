# Guia de Instalação no Celular & Geração de Executável .APK

O aplicativo **Fluência Acelerada** já está 100% configurado para rodar em smartphones como aplicativo nativo. Existem duas formas simples de utilizá-lo no celular:

---

## Método 1: Instalação Instantânea no Celular (PWA - Recomendado)
Este método dispensa o download de arquivos pesados ou alertas de "fontes desconhecidas". O app roda em tela cheia com ícone próprio na gaveta de aplicativos.

### No Android (Google Chrome):
1. Abra a URL do app no Chrome do smartphone.
2. Toque no banner superior **"Instalar Aplicativo"** ou nos 3 pontinhos do Chrome ➔ **"Instalar aplicativo"** / **"Adicionar à tela inicial"**.
3. O ícone oficial será adicionado à tela inicial. Ao abrir, ele roda sem barra de navegação, com suporte a microfone, reconhecimento de voz e banco de dados.

### No iPhone / iPad (Apple Safari):
1. Abra a URL no Safari.
2. Toque no botão **Compartilhar** (ícone quadrado com seta para cima).
3. Selecione **"Adicionar à Tela de Início"**.
4. Toque em **"Adicionar"**.

---

## Método 2: Gerar o Pacote Executável .APK (Android)

Se você precisa especificamente do arquivo executável `.apk` para testes ou distribuição:

### Opção A: PWABuilder (Online, oficial da Microsoft / Google TWA)
1. Acesse: [https://www.pwabuilder.com/](https://www.pwabuilder.com/)
2. Insira a URL pública da sua aplicação.
3. Clique em **"Start"** (o PWABuilder validará o manifesto e os ícones PNG de 192px e 512px).
4. Clique em **"Package for Android"**.
5. Baixe o pacote `.zip`. Nele constará o arquivo `.apk` assinado para testes (debug APK).
6. Transfira para o celular e instale!

### Opção B: Linha de Comando com Google Bubblewrap CLI
```bash
# 1. Instalar o utilitário oficial da Google
npm install -g @bubblewrap/cli

# 2. Inicializar o projeto com base no manifesto do app
bubblewrap init --manifest="https://SUA-URL-AQUI/manifest.json"

# 3. Compilar o pacote executável .apk
bubblewrap build
```
O arquivo APK gerado estará pronto para instalação via `adb install` ou compartilhamento direto para o aparelho.
