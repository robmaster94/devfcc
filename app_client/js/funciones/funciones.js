//var wsUri = "ws://10.162.254.65:8081/OCPPGateway15/CentralSystemService"; //dirección CSS estación de recarga
var wsUri = "ws://10.162.254.65:8081/OCPPGateway15/CentralSystemService/EFACECES1"; //websocket OCPP ESTACIÓN RECARGA MURCIA
var wsUri = "ws://"; //websocket OCPP ESTACIÓN RECARGA WALLBOX

var wsUriLocal = 0; //igual que la anterior, cambiando el identificador de la estación de recarga

var xhr;
var contador = 0;

function conectarElectrolinera() {

    var wsUri = "ws://10.162.254.65:8081/OCPPGateway15/CentralSystemService/EFACECES1";

    var output;
    var random = Math.floor(15000000 + (Math.random() * 5000000)); //numero solicitud randomizado

    var randomst = random.toString();

    var request = JSON.stringify([2, randomst, "Heartbeat", {}]);

    alert("Conectándose a la URI " + wsUri + " con petición " + request);

    function init() {
        output = document.getElementById("output");
        testWebSocket();
    }

    function testWebSocket() {
        websocket = new WebSocket(wsUri, ['ocpp1.6']);
        websocket.onopen = function (evt) {
            onOpen(evt)
        };
        websocket.onclose = function (evt) {
            onClose(evt)
        };
        websocket.onmessage = function (evt) {
            onMessage(evt)
        };
        websocket.onerror = function (evt) {
            onError(evt)
        };
    }

    function onOpen(evt) {
        writeToScreen(request);
        doSend(request);
    }

    function onClose(evt) {
        writeToScreen("BYE! :)");
    }

    function onMessage(evt) {
        //    writeToScreen('<span style="color: blue;"> RESPONSE: ' + JSON.parse(evt.data) + '</span>');
        writeToScreen('<span style="color: blue;"> RESPONSE: ' + evt.data + '</span>');
        websocket.close();
    }

    function onError(evt) {
        //   writeToScreen('<span style="color: red;"> ERROR: ' + JSON.parse(evt.data) + '</span>');
        writeToScreen('<span style="color: red;"> ERROR: ' + evt.data + '</span>');
    }

    function doSend(message) {
        writeToScreen("SENT: " + message);
        websocket.send(message);
    }

    function writeToScreen(message) {
        var pre = document.createElement("p");
        pre.className = "lead";
        pre.style.wordWrap = "break-word";
        pre.innerHTML = message;
        pruebas.appendChild(pre);
    }

    window.addEventListener("load", init, false);
}

/*function connectElect() {
    xhr = new XMLHttpRequest();
    xhr.open("get", "prueba.php", true);
    xhr.onreadystatechange = procesarRespuesta;
    xhr.send();

    function procesarRespuesta() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                //alert("prueba exitosa, parrafos a mostrar: "+contador);
                if (contador < 5) {
                    contador++;
                    var div = document.getElementById("pruebas");
                    var par = document.createElement("p");
                    var texto = document.createTextNode(xhr.responseText);
                    par.appendChild(texto);
                    div.appendChild(par);
                } else {
                    alert("¡Límite máximo alcanzado! Restaurando...");
                    window.location.reload();
                }

            } else {
                alert("Ocurrió un problema");
            }
        }

    }
}*/

/*var wsUri = "ws://192.168.0.2:8080/EVCConfig"; //dirección IP cliente estación recarga
var wsUri = "ws://192.168.0.2:8080"; //dirección websocket cliente estación recarga
var output;
var random = Math.floor(15000000 + (Math.random() * 5000000)); //numero solicitud randomizado
/*    var request = JSON.stringify([2, random.toString, "meterValues", 
                                  {"chargePointVendor":"VendorX", 
                                   "chargePointModel":"SingleSocketCharger"}]);  
var randomst = random.toString();

var request = JSON.stringify([2, randomst, "Heartbeat", {}]);
alert(request);*/



/*var miObjetoJSON = {
    2,
    randomst,
    "Heartbeat",
    {}
};
    ¡¡¡Mirar cómo se construye un objeto JSON sin pasar por el método stringify!!!
*/
