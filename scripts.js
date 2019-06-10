document.getElementById("filtroNome").addEventListener("change", listaPersonagensFct);

listaPersonagensFct(0);

function listaPersonagensFct(offset){
    document.getElementById('listaPersonagens').innerText = "";

    const listaPersonagens = document.getElementById('listaPersonagens');

    const container = document.createElement('div');
    container.setAttribute('class', 'container');
    
    listaPersonagens.appendChild(container);

    var request = new XMLHttpRequest();
    var nomeFiltro = document.getElementById("filtroNome").value;
    
    request.open('GET', 'https://kitsu.io/api/edge/characters?page[limit]=10&page[offset]=' + offset + '&filter[name]=' + nomeFiltro);
    
    request.onreadystatechange = function () {
        if (this.readyState === 4) {
    
        var data = JSON.parse(this.responseText);

        const linhaH = document.createElement('tr');
        linhaH.setAttribute('class', 'linha container');                

        const personagensH = document.createElement('th');
        personagensH.setAttribute('class', 'personagemH');
        personagensH.textContent = "Personagem";

        const descricaoH = document.createElement('th');
        descricaoH.setAttribute('class', 'descricaoH');
        descricaoH.textContent = "Descrição";

        linhaH.appendChild(personagensH);
        linhaH.appendChild(descricaoH);
        container.appendChild(linhaH);
    
        data.data.forEach(characters => {
            const linha = document.createElement('tr');
            linha.setAttribute('class', 'linhaItem container ');            

            const  thPersonagem = document.createElement('th');
            thPersonagem.setAttribute('class', 'thPersonagem');

            const  containerPernsonagem = document.createElement('div');
            containerPernsonagem.setAttribute('class', 'containerPernsonagem container');            

            const  imagem = document.createElement('img');
            imagem.setAttribute('class', 'imgPersonagem');            

            imagem.src = characters.attributes.image == null?"":characters.attributes.image.original;
    
            const  nome = document.createElement('span');
            nome.setAttribute('class', 'nomePersonagem');
            nome.textContent = characters.attributes.canonicalName;
    
            const contDesc = document.createElement('th');
            contDesc.setAttribute('class', 'thDescricao');

            const descricao = document.createElement('span');
            descricao.setAttribute('class', 'descrPersonagem');
            characters.attributes.description = characters.attributes.description.length >= 200?characters.attributes.description.substring(0, 200)+"...":characters.attributes.description;
            descricao.textContent = characters.attributes.description;
    

            container.appendChild(linha);
            contDesc.appendChild(descricao);
            containerPernsonagem.appendChild(imagem);
            containerPernsonagem.appendChild(nome);
            thPersonagem.appendChild(containerPernsonagem);
            linha.appendChild(thPersonagem);
            linha.appendChild(contDesc);            
        });
        
      }
    };
    
    request.send();
}
