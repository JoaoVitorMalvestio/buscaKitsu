var offsetGlobal = 0;

document.getElementById("filtroNome").addEventListener("change", function() { listaPersonagensFct(0); });
document.getElementById("btFechaModal").addEventListener("click",  function() { var modal = document.getElementById("modal"); modal.setAttribute('class','modal-hidden'); });

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
    var montaFiltro = nomeFiltro==""?"":("&filter[name]=" + nomeFiltro);
    
    request.open('GET', 'https://kitsu.io/api/edge/characters?page[limit]=10&page[offset]=' + offsetGlobal + montaFiltro);
    
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
        descricaoH.textContent = "Descri��o";

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

            imagem.src = characters.attributes.image == null?"no-imag.png":characters.attributes.image.original;
    
            const  nome = document.createElement('span');
            nome.setAttribute('class', 'nomePersonagem');
            nome.textContent = characters.attributes.canonicalName;
    
            const contDesc = document.createElement('th');
            contDesc.setAttribute('class', 'thDescricao');

            const descricao = document.createElement('span');
            descricao.setAttribute('class', 'descrPersonagem');
            characters.attributes.description = tiraTagBr(characters.attributes.description);
            characters.attributes.description = characters.attributes.description.length >= 200?characters.attributes.description.substring(0, 200)+"...":characters.attributes.description;
            descricao.textContent = tiraTagBr(characters.attributes.description);

            container.appendChild(linha);
            contDesc.appendChild(descricao);
            containerPernsonagem.appendChild(imagem);
            containerPernsonagem.appendChild(nome);
            thPersonagem.appendChild(containerPernsonagem);
            linha.appendChild(thPersonagem);
            linha.appendChild(contDesc);            
        });

        //Gerar container pagina��o
        const offsetMax = getOffSetMax(data.links.last); 

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
        btNext.setAttribute('class', (((offsetGlobal>offsetMax-10)))?'seta-direita-disabled':'seta-direita');
        if (!(offsetGlobal>(offsetMax-10))) btNext.addEventListener("click", function() { listaPersonagensFct(10,true); } );

        contBtPrev.appendChild(btPrev);
        contBtNext.appendChild(btNext);
        contPaginacao.appendChild(contBtPrev);

        

        //Gera os numeros de pagina
        for (var j=1; j<=6 /*parseInt(offsetMax+10) >= (j*10)*/ ; j++){

            const numPagDiv = document.createElement('div');
            numPagDiv.setAttribute('class','numPag' + (estaNaPagina(j)?' numPagSel':'') + (j>3?' hiddenMobile':''));
            numPagDiv.addEventListener("click", function() { listaPersonagensFct( ((numPagDiv.textContent - 1) * 10) ); } );

            const numPagText = document.createElement('div');
            numPagText.setAttribute('class',(estaNaPagina(j)?'numPagTextSel':'numPagText'));
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

function estaNaPagina(j){
    return (((j-1) * 10)==offsetGlobal);
}

function getOffSetMax(link){
    var v = link.split("=");

    var aux = parseInt(v[v.length-1]);

    return parseInt(aux);
}

function listaMediaPersonagemFct(id){
    var request = new XMLHttpRequest();
    
    request.open('GET', 'https://kitsu.io/api/edge/characters/' + id + '/media-characters');
    
    var modal = document.getElementById("modal");
    modal.setAttribute('class','modal-mostra');

    const linha            = document.createElement('tr');    
    const tipoHeader       = document.createElement('th');    
    const tituloImgHeader  = document.createElement('th');

    tipoHeader.textContent      = 'Tipo';
    tipoHeader.setAttribute('class','tipoH');
    
    tituloImgHeader.textContent = 'Nome';    
    tituloImgHeader.setAttribute('class','tituloImgH');    

    const table = document.getElementById("contMedia");

    table.innerHTML = ''; //Limpa table

    linha.appendChild(tipoHeader);
    linha.appendChild(tituloImgHeader);
    table.appendChild(linha);
    
    request.onreadystatechange = function () {
        if (this.readyState === 4) {
    
            var mediaCharacterObj = JSON.parse(this.responseText);

            mediaCharacterObj.data.forEach(mediaCharacter => {
                var media = getMediaData(mediaCharacter.relationships.media.links.related);
            });
        }
    }
    request.send();
}

function getMediaData(jsonLink){
    var request = new XMLHttpRequest();
    
    request.open('GET', jsonLink);
    
    request.onreadystatechange = function () {
        if (this.readyState === 4) {
    
            var media = JSON.parse(this.responseText);   
            
            const linha        = document.createElement('tr');
            const tipoCont     = document.createElement('td');
            const tipoText     = document.createElement('span');
            const nomeImgCont  = document.createElement('td');
            const imgCont      = document.createElement('div');
            const img          = document.createElement('img');
            const tituloText   = document.createElement('span');

            tipoText.textContent   = media.data.type;

            img.src                = media.data.attributes.posterImage.tiny;
            img.setAttribute('class','imgPersonagem');

            tituloText.textContent = media.data.attributes.canonicalTitle;
            tituloText.setAttribute('class','tituloText');

            nomeImgCont.setAttribute('class','nomeImgCont');

            tipoCont.setAttribute('class','tipoCont');

            tipoCont.appendChild(tipoText);

            imgCont.appendChild(img);

            nomeImgCont.appendChild(imgCont);
            nomeImgCont.appendChild(tituloText);

            linha.appendChild(tipoCont);
            linha.appendChild(nomeImgCont);
            

            var tableMedia = document.getElementById("contMedia");
            tableMedia.appendChild(linha);            

            //document.getElementById("contMedia").innerHTML += "<tr><td>" + media.data.type + "<td>" + media.data.attributes.canonicalTitle;
        }
    }
    request.send();
}

function tiraTagBr(texto){
    //Tira a tag <br> do texto
    return texto = texto.replace(/<br>/g," ");
}