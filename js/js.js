var jogo;
var timer;
var tempo = 60;

var pontosFogo = 0;
var pontosAgua = 0;

var tecla = [];

var fogoNaPorta = false;
var aguaNaPorta = false;

var somColeta = new Audio("sons/coleta.mp3");
var somVitoria = new Audio("sons/vitoria.mp3");
var somGameOver = new Audio("sons/gameover.mp3");

function start(){
    $("#inicio").remove();
    $("#fundoGame").css("background-image","url('img/fundo3.png')");
    $("#fundoGame").append("<div id='placar'>Fogo: <span id='pf'>0</span> | Água: <span id='pa'>0</span></div>");
    $("#fundoGame").append("<div id='instrucao'>🎯 COLETE 5 CRISTAIS DE CADA PERSONAGEM E LEVE FOGO E ÁGUA ATÉ A PORTA ANTES DE 1 MINUTO!</div>");
    $("#fundoGame").append("<div id='tempo'>60</div>");
    $("#fundoGame").append("<div id='barraTempo'><div id='progressoTempo'></div></div>");
    $("#fundoGame").append("<div id='btnSair' onclick='sairJogo()'>SAIR</div>");
    $("#fundoGame").append("<div id='jogadorFogo'></div>");
    $("#fundoGame").append("<div id='jogadorAgua'></div>");
    $("#fundoGame").append("<div id='cristalFogo'></div>");
    $("#fundoGame").append("<div id='cristalAgua'></div>");
    $("#fundoGame").append("<div id='porta'></div>");

    $("#porta").hide();
    $("#cristalFogo").css({left: 500, top: 200});
    $("#cristalAgua").css({left: 700,top: 350});

    $(document).keydown(function(e){tecla[e.which] = true;});
    $(document).keyup(function(e){tecla[e.which] = false;});

    timer = setInterval(contagem,1000);
    jogo = setInterval(loop,30);
}

function loop(){
    moverFogo();
    moverAgua();
    colisaoFogo();
    colisaoAgua();
    verificarPorta();
    verificarVitoria();
}

function moverFogo(){
    var x = parseInt($("#jogadorFogo").css("left"));
    var y = parseInt($("#jogadorFogo").css("top"));

    if(tecla[65]) x -= 5;
    if(tecla[68]) x += 5;
    if(tecla[87]) y -= 5;
    if(tecla[83]) y += 5;

    if(x < 0) x = 0;
    if(y < 0) y = 0;

    if(x > 880) x = 880;
    if(y > 560) y = 560;

    $("#jogadorFogo").css({left:x, top:y});
}

function moverAgua(){
    var x = parseInt($("#jogadorAgua").css("left"));
    var y = parseInt($("#jogadorAgua").css("top"));

    if(tecla[37]) x -= 5;
    if(tecla[39]) x += 5;
    if(tecla[38]) y -= 5;
    if(tecla[40]) y += 5;

    if(x < 0) x = 0;
    if(y < 0) y = 0;

    if(x > 880) x = 880;
    if(y > 560) y = 560;

    $("#jogadorAgua").css({ left:x, top:y});
}

function colisaoFogo(){
    if(colidiu("#jogadorFogo","#cristalFogo")){
        pontosFogo++;

        $("#pf").html(pontosFogo);
        somColeta.currentTime = 0;
        somColeta.play();

        $("#cristalFogo").css({
            left: Math.floor(Math.random()*850),
            top: Math.floor(Math.random()*550)
        });
    }
}

function colisaoAgua(){

    if(colidiu("#jogadorAgua","#cristalAgua")){

        pontosAgua++;

        $("#pa").html(pontosAgua);

        somColeta.currentTime = 0;
        somColeta.play();

        $("#cristalAgua").css({
            left: Math.floor(Math.random()*850),
            top: Math.floor(Math.random()*550)
        });
    }
}

function verificarPorta(){

    if(
        pontosFogo >= 5 &&
        pontosAgua >= 5
    ){

        $("#porta").show();

        if(colidiu("#jogadorFogo","#porta")){
            fogoNaPorta = true;
        }

        if(colidiu("#jogadorAgua","#porta")){
            aguaNaPorta = true;
        }
    }
}

function verificarVitoria(){

    if(
        fogoNaPorta &&
        aguaNaPorta
    ){

        clearInterval(jogo);
        clearInterval(timer);

        somVitoria.play();

        $("#fundoGame").html(
        "<div id='telaFinal'>" +
        "<img src='img/vitoria.png' width='950' height='630'>" +
        "</div>"
        );

        $("#telaFinal").click(function(){
            location.reload();
        });
    }
}

function contagem(){

    tempo--;

    $("#tempo").html(tempo);

    var largura = (tempo / 60) * 200;

    $("#progressoTempo").css(
        "width",
        largura + "px"
    );

    if(tempo <= 0){
        clearInterval(jogo);
        clearInterval(timer);

        somGameOver.play();

        $("#fundoGame").html("<div id='telaFinal'>" + "<img src='img/gameover.png' width='950' height='630'>" +"</div>");

        $("#telaFinal").click(function(){location.reload();});}
}

function sairJogo(){
    if(confirm("Deseja sair do jogo?")){location.reload();}
}

function colidiu(a,b){
    var aX = $(a).offset().left;
    var aY = $(a).offset().top;

    var bX = $(b).offset().left;
    var bY = $(b).offset().top;

    return(
        Math.abs(aX - bX) < 50 &&
        Math.abs(aY - bY) < 50
    );
}