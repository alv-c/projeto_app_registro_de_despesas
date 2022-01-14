

/**** AppJS ****/

	class Despesa {

		constructor (ano, mes, dia, tipo, descricao, valor) {
			this.ano = ano
			this.mes = mes
			this.dia = dia
			this.tipo = tipo
			this.descricao = descricao
			this.valor = valor
		}

		validarDados () {
			for (let x in this) {
				if (this[x] == undefined || this[x] == '' || this[x] == null) {
					return false
				}
			}

			return true
		}

	}

	class BD {

		constructor () {
			let id = localStorage.getItem ('id')

			//verifica se ja existe um id
			if (id === null) {
				//iniciando um id para local storage, caso ainda não exista
				localStorage.setItem ('id', 0)
			}
		}

		getProximoId () {
			
			//pega o id existente, e incrementa com mais um
			let proximoId = localStorage.getItem ('id')
			//incremento de ID
			return parseInt(proximoId) + 1
		}

		gravar (d) {
			let id = this.getProximoId ()

			//para settar um item dentro de local storage, no caso o objeto despesa
			/*id é o nome da chave, e 'd' (despesa recebido como parâmetro) é são os dados do objeto despesa, 
			convertido para JSON*/
			localStorage.setItem (id, JSON.stringify(d))

			//atualização do valor id incrementado na chamada do método this.getProximoId ()
			localStorage.setItem ('id', id)
		}

		recuperarTodosRegistros () {

			let id = localStorage.getItem ('id')

			let arrayDespesas = Array ()

			for (let i = 1; i <= id; i++) {
				//JSON.parse tranforma um objeto json em objeto literal para tratamento dentro da aplicação
				let item = JSON.parse(localStorage.getItem (i))

				if (item === null) {
					continue
				}

				item.id = i
				//insere o objeto item no arrayDespesas
				arrayDespesas.push (item)

			}

			//retorna arrayDespesas contendo array de objetos
			return arrayDespesas

		}

		pesquisar (despesa) {
			
			let despesasFiltradas = Array ()

			despesasFiltradas = this.recuperarTodosRegistros ()

			console.log (despesasFiltradas)

			//filtro pelo ano
			if (despesa.ano != '') {
				/*como o arrayFilter não atua no array original, criando um novo array filtrado, 
				atribui-se o valor do array filtrado ao array original, para atualizar o valor do array 
				original*/
				despesasFiltradas = despesasFiltradas.filter (d => d.ano == despesa.ano /*arrow function*/)
				/*arrow function recebida como parâmetro compara o ano do array filtrado com o ano do objeto
				 despesa mandada como parâmetro */
			}

			//filtro pelo mês
			if (despesa.mes != '') {
				despesasFiltradas = despesasFiltradas.filter (d => d.mes == despesa.mes)
			}

			//filtro pelo dia
			if (despesa.dia != '') {
				despesasFiltradas = despesasFiltradas.filter (d => d.dia == despesa.dia)
			}

			//filtro pelo tipo
			if (despesa.tipo != '') {
				despesasFiltradas = despesasFiltradas.filter (d => d.tipo == despesa.tipo)
			}

			//filtro descrição
			if (despesa.descricao != '') {
				despesasFiltradas = despesasFiltradas.filter (d => d.descricao == despesa.descricao)
			}

			//filtro valor
			if (despesa.valor != '') {
				despesasFiltradas = despesasFiltradas.filter (d => d.valor == despesa.valor)
			}

			return despesasFiltradas


		}

		remover (id) {
			//para remover um objeto de localStorage
			localStorage.removeItem (id)
		}


	}

	let bd = new BD()


	let cadastrarDespesa = () => {

		let ano = document.getElementById ('ano')
		let mes = document.getElementById ('mes')
		let dia = document.getElementById ('dia')
		let tipo = document.getElementById ('tipo')
		let descricao = document.getElementById ('descricao')
		let valor = document.getElementById ('valor')

		let despesa = new Despesa(ano.value, mes.value, dia.value, tipo.value, descricao.value, valor.value)

		if (despesa.validarDados () == true) {
			//chama objeto bd que contém o método gravar
			bd.gravar(despesa) //chamada da função gravar, mandando objeto 'despesa' como parâmetro

			let elementos = document.getElementsByClassName('campo')

			for (let y in elementos) {
				elementos[y].value = ''
			}

			document.getElementById ('exampleModalLabel').className = 'text-success'
			document.getElementById ('exampleModalLabel').innerHTML = 'Sucesso no registro'
			document.getElementById ('corpoModal').innerHTML = 'Despesa registrada com sucesso.'
			document.getElementById ('botaoModal').className = 'btn btn-success'
			document.getElementById ('botaoModal').innerHTML = 'Fechar'
			$('#modalGravacao').modal('show')
		}

		else {
			document.getElementById ('exampleModalLabel').className = 'text-danger'
			document.getElementById ('exampleModalLabel').innerHTML = 'Erro na gravação'
			document.getElementById ('corpoModal').innerHTML = 'Preencha os dados corretamente.'
			document.getElementById ('botaoModal').className = 'btn btn-danger'
			document.getElementById ('botaoModal').innerHTML = 'Voltar para corrigir'
			$('#modalGravacao').modal('show')
		}

	}

	function carregaListaDespesas (despesas = Array (), filtro = false) {

	
		/*array despesas recebido como parâmetro recebe array de objetos retornado da função 
		recuperarTodosRegistros do objeto bd*/
		if (despesas.length == 0 && filtro == false) {
			despesas = bd.recuperarTodosRegistros ()
		}

		//selecionamento o elemento tbody da tabela
		let tabela = document.getElementById ('corpo-tabela')
		tabela.innerHTML = ''

		despesas.forEach (function (d) {

			//método insertRow para inserir uma tag <tr> dentro de uma tabela
			let linha = tabela.insertRow ()

			//método insertCell() para criar uma tag <td> dentro da <tr> criada acima, 
			//neste caso será criada 4 <td>, que representam as 4 colunas da tabela
			linha.insertCell (0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`

			//verificação de tipo

			switch (d.tipo) {
				case '1':
					d.tipo = 'Alimentação'
					break

				case '2':
					d.tipo = 'Educação'
					break

				case '3':
					d.tipo = 'Lazer'
					break

				case '4':
					d.tipo = 'Saúde'
					break

				case '5':
					d.tipo = 'Transporte'
					break
			}

			linha.insertCell (1).innerHTML = d.tipo
			linha.insertCell (2).innerHTML = d.descricao
			linha.insertCell (3).innerHTML = d.valor

			//cria um elemento botao
			let btn = document.createElement ("Button")
			btn.className = 'btn btn-danger'
			btn.innerHTML = '<i class="fas fa-times"></i>'
			btn.id = `id_despesa_${d.id}`
			btn.onclick = function () {
				
				let id = this.id.replace('id_despesa_', '')
				bd.remover(id)

				//método para recarregar a página
				window.location.reload()

			}
			linha.insertCell (4).append (btn)

			console.log (d)


		})
		
	}

	function pesquisarDespesa () {
		let ano = document.getElementById ('ano').value
		let mes = document.getElementById ('mes').value
		let dia = document.getElementById ('dia').value
		let tipo = document.getElementById ('tipo').value
		let descricao = document.getElementById ('descricao').value
		let valor = document.getElementById ('valor').value

		let despesa = new Despesa (ano, mes, dia, tipo, descricao, valor)

		//variavel despesas recebe o array filtrado como retorno do método pesquisar do objeto bd
		let despesas =  bd.pesquisar (despesa)

		/*chama a função carrega lista despesas, enviado como parâmetro o array retornado de 
		bd.pesquisar, e o valor true, para indicar que se trata de um filtro*/
		carregaListaDespesas (despesas, true)
	}



		
		