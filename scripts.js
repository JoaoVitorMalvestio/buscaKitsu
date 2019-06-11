var offsetGlobal = 0;

document.getElementById("filtroNome").addEventListener("change", function() { listaPersonagensFct(0); });

listaPersonagensFct(0);

function listaPersonagensFct(offset,acao){
    if (acao==null) {
        offsetGlobal = offset;
    } 
    else{
        offsetGlobal+=offset;
    } 

    document.getElementById('listaPersonagens').innerText = "";

    const listaPersonagens = document.getElementById('listaPersonagens');

    const container = document.createElement('div');
    container.setAttribute('class', 'container');
    
    listaPersonagens.appendChild(container);

    var request = new XMLHttpRequest();
    var nomeFiltro = document.getElementById("filtroNome").value;
    
    request.open('GET', 'https://kitsu.io/api/edge/characters?filter[name]=' + nomeFiltro + '&page[limit]=10&page[offset]=' + offsetGlobal);
    
    request.onreadystatechange = function () {
        if (this.readyState === 4) {
    
        var data = JSON.parse(this.responseText);

        //Gera linha header da table
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
    
        //Gera linha de dados da table
        data.data.forEach(characters => {
            const linha = document.createElement('tr');
            linha.setAttribute('class', 'linhaItem container '); 
            linha.addEventListener("click", function() { listaMediaPersonagemFct(characters.id); } );

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

        //Gerar container paginação
        const offsetMax = parseInt(getOffSetMax(data.links.last)); 

        const contPaginacao = document.createElement('div');
        contPaginacao.setAttribute('class', 'container justify-center contPaginacao');
        
        const contBtPrev = document.createElement('div');
        contBtPrev.setAttribute('class', 'contSeta');

        const btPrev = document.createElement('div');
        btPrev.setAttribute('class', (offsetGlobal==0?'seta-esquerda-disabled':'seta-esquerda'));
        if (offsetGlobal>0) btPrev.addEventListener("click", function() { listaPersonagensFct(-10,true); } );

        const contBtNext = document.createElement('div');
        contBtNext.setAttribute('class', 'contSeta');

        const btNext = document.createElement('div');
        btNext.setAttribute('class', ((offsetMax-10)<offsetGlobal)?'seta-direita-disabled':'seta-direita');
        if (!((offsetMax-10)<offsetGlobal)) btNext.addEventListener("click", function() { listaPersonagensFct(10,true); } );

        contBtPrev.appendChild(btPrev);
        contBtNext.appendChild(btNext);
        contPaginacao.appendChild(contBtPrev);

        //Gera os numeros de pagina
        for (var j=1; (offsetMax+10)>=(j*10); j++){

            const numPagDiv = document.createElement('div');
            numPagDiv.setAttribute('class',(((j-1) * 10)==offsetGlobal)?'numPagSel':'numPag');
            numPagDiv.addEventListener("click", function() { listaPersonagensFct( ((numPagDiv.textContent - 1) * 10) ); } );

            const numPagText = document.createElement('div');
            numPagText.setAttribute('class',(((j-1) * 10)==offsetGlobal)?'numPagTextSel':'numPagText');
            numPagText.textContent = j;

            numPagDiv.appendChild(numPagText);
            contPaginacao.appendChild(numPagDiv);
        }
        
        contPaginacao.appendChild(contBtNext);
        container.appendChild(contPaginacao);

      }
    };
    
    request.send();
}

function getOffSetMax(link){
    var v = link.split("=");

     return v[v.length-1];
}

function listaMediaPersonagemFct(id){
    var request = new XMLHttpRequest();
    
    request.open('GET', 'https://kitsu.io/api/edge/characters/' + id + '/media-characters');
    
    var medias = [];

    request.onreadystatechange = function () {
        if (this.readyState === 4) {
    
            var mediaCharacterObj = JSON.parse(this.responseText);

            

            mediaCharacterObj.data.forEach(mediaCharacter => {
                var media;
                var retornoMedia = new Promise( ()=> media = getMediaData(mediaCharacter.relationships.media.links.related, (value) => medias.push(value)));
                //retornoMedia.then(alert(media));
            });
        }
    }
    request.send();
}

function getMediaData(jsonLink, consumer){
    var request = new XMLHttpRequest();
    
    request.open('GET', jsonLink);
    
    request.onreadystatechange = function () {
        if (this.readyState === 4) {
    
            var media = JSON.parse(this.responseText);
            
            consumer(media);

            alert(media.data.type + " " + media.data.attributes.canonicalTitle);
        }
    }
    request.send();
}