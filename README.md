# Projeto integrador

Este guia explica passo a passo como usar o Pytest para executar testes no Visual Studio Code, mesmo se você nunca usou testes antes.

## Parte 1: Preparação Inicial

### Passo 1: Instalar o Pytest

Primeiro, você precisa instalar o Pytest. Abra o terminal no VS Code:

1. Clique no menu `Terminal` no topo da tela
2. Selecione `Novo Terminal`
3. No terminal que abrir, digite exatamente este comando:

```
pip install pytest
```

4. Pressione Enter e aguarde a instalação terminar

### Passo 2: Verificar se o Pytest foi instalado corretamente

Para ter certeza que o Pytest foi instalado, digite no terminal:

```
pytest --version    py -m pytest --version
```

Você deve ver algo como `pytest 8.x.x` (o número pode variar).

## Parte 2: Executando os Testes

### Passo 3: Executar todos os testes

Para executar todos os testes de uma vez, digite no terminal:

```
pytest
```

Isso vai encontrar e executar todos os arquivos que começam com `test_`.

### Passo 4: Ver detalhes dos testes

Para ver mais detalhes sobre cada teste, use a opção `-v` (de "verbose"):

```
pytest -v
```

Agora você verá o nome de cada teste e se ele passou ou falhou.

### Passo 5: Executar um arquivo de teste específico

Se você quiser executar apenas os testes básicos:

```
pytest test_basico.py -v
```

Ou apenas os testes avançados:

```
pytest test_avancado.py -v
```

### Passo 6: Executar um teste específico

Para executar apenas um teste específico, use o nome do arquivo seguido de dois pontos (`:`) e o nome da função de teste:

```
pytest test_basico.py::test_soma -v
```

### Passo 7: Executar testes que contenham uma palavra específica

Para executar todos os testes que tenham "soma" no nome:

```
pytest -k soma -v
```

O `-k` permite filtrar testes pelo nome.

## Parte 3: Entendendo os Resultados

### O que significam os símbolos nos resultados:

- `.` = Teste passou
- `F` = Teste falhou
- `s` = Teste foi pulado (skip)
- `x` = Teste falhou, mas era esperado (xfail)

### Exemplo de resultado:

```
test_basico.py::test_soma PASSED                                [ 16%]
test_basico.py::test_soma_funcao PASSED                         [ 33%]
test_basico.py::test_subtracao PASSED                           [ 50%]
test_basico.py::test_multiplicacao PASSED                       [ 66%]
test_basico.py::test_divisao PASSED                             [ 83%]
test_basico.py::test_divisao_por_zero PASSED                    [100%]
```

Isso significa que todos os testes passaram!

### Se um teste falhar, você verá algo como:

```
test_basico.py::test_soma FAILED                                [ 16%]
```

E abaixo, detalhes sobre o que deu errado.

## Parte 4: Dicas Extras

### Dica 1: Executar testes com print

Se você quiser ver os prints que estão nos testes (como na fixture `db`), use:

```
pytest -v test_avancado.py::test_usando_fixture -s
```

A opção `-s` mostra os prints durante a execução.

### Dica 2: Gerar relatório em HTML

Para gerar um relatório bonito em HTML (precisa instalar primeiro):

```
pip install pytest-html
pytest --html=relatorio.html
```

Isso vai criar um arquivo `relatorio.html` que você pode abrir no navegador.

### Dica 3: Verificar cobertura de testes

Para ver quanto do seu código está coberto pelos testes (precisa instalar primeiro):

```
pip install pytest-cov
pytest --cov=operacoes
```

## Solução de Problemas Comuns

### Problema 1: "No module named pytest"
Solução: Instale o pytest novamente com `pip install pytest`

### Problema 2: "No module named operacoes"
Solução: Certifique-se de estar no diretório correto. Use `cd caminho/para/pytest_exemplos_slides`

### Problema 3: "ModuleNotFoundError"
Solução: Verifique se todos os arquivos estão na mesma pasta
