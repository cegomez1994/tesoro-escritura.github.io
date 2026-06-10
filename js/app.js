    const menu = document.getElementById("menu");
    const selectScreen = document.getElementById("selectScreen");
    const islandScreen = document.getElementById("islandScreen");
    const matchScreen = document.getElementById("matchScreen");
    const btnIniciar = document.getElementById("btnIniciar");
    const btnSalir = document.getElementById("btnSalir");
    //const progressFill = document.getElementById("progressFill");
	//let monedas = 10;          // Puedes poner el valor inicial que quieras
    let personajeSeleccionado = null;
	const matchScreen2 = document.getElementById("matchScreen2");
    const screen7 = document.getElementById("screen7");
	let nivel1Completado = false;
	const screen14 = document.getElementById("screen14");

	// ================================
	// SISTEMA GLOBAL DE JUEGO
	// ================================

	let puntaje = localStorage.getItem("puntaje")
	  ? parseInt(localStorage.getItem("puntaje"))
	  : 0;

	let monedas = localStorage.getItem("monedas")
	  ? parseInt(localStorage.getItem("monedas"))
	  : 0;

	let progreso = localStorage.getItem("progreso")
	  ? parseInt(localStorage.getItem("progreso"))
	  : 1;

	// Guardar datos
	function guardarProgreso() {
	  localStorage.setItem("puntaje", puntaje);
	  localStorage.setItem("monedas", monedas);
	  localStorage.setItem("progreso", progreso);
	}

	// Sumar recompensa
	function sumarRecompensa(puntos, coin) {
	  puntaje += puntos;
	  monedas += coin;
	  progreso += 10; // aumenta 10% por pantalla
	  
	  if (progreso > 100) progreso = 100;

	  guardarProgreso();
	  actualizarUI();
	}

	// Mostrar en pantalla
	function actualizarUI() {
	  const p = document.getElementById("puntajeUI");
	  const m = document.getElementById("monedasUI");
	  const barra = document.getElementById("progressFill");
	  const coinCount = document.getElementById("coinCount");

	  if (p) p.textContent = puntaje; 
	  if (m) m.textContent = monedas;
	  if (barra) barra.style.width = progreso + "%";
	  if (coinCount) coinCount.textContent = monedas;

	  //if (progressFill) {
		//progressFill.style.width = progreso + "%";
	  //}
	}
	
	window.onload = function () {
		   // REINICIAR TODO SIEMPRE
	  localStorage.removeItem("puntaje");
	  localStorage.removeItem("monedas");
	  localStorage.removeItem("progreso");

	  // valores en cero
	  puntaje = 0;
	  monedas = 0;
	  progreso = 0;
	  actualizarUI();
	  cambiarVideo("menu");
	};

    function cambiarPantalla(ocultar, mostrar) {
      ocultar.classList.remove("active");
      mostrar.classList.add("active");
	  // sonido de navegacion
      playClick();
	  //  CAMBIAR VIDEO AUTOMATICAMENTE
      cambiarVideo(mostrar.id);
    }

    btnIniciar.addEventListener("click", () => {
	  playClick();        //  sonido
      iniciarMusica();    //  iniciar musica
      cambiarPantalla(menu, selectScreen);
    });

    btnSalir.addEventListener("click", () => {
      cambiarPantalla(selectScreen, menu);
    });

    document.querySelectorAll(".character").forEach(caja => {
      caja.addEventListener("click", () => {
	    playClick();  //sonido
        personajeSeleccionado = caja.dataset.id;
        cambiarPantalla(selectScreen, islandScreen);
      });
    });

  document.querySelectorAll(".island").forEach(isla => {
  isla.addEventListener("click", () => {

    const spot = isla.dataset.spot;

    if ((spot === "2" || spot === "3") && !nivel1Completado) {
      alert("Completa el Nivel 1 para desbloquear esta isla");
      return;
    } 
	
	if (spot === "1") {
      cambiarPantalla(islandScreen, levelScreen);   // Nivel 1
    }

    if (spot === "2") {
      cambiarPantalla(islandScreen, screen14);   // Aqui iria tu nuevo nivel
	  return;
    }
     // ISLA 3 (bloqueada por ahora)
    if (spot === "3") {
       cambiarPantalla(islandScreen, screen28);   // Aqui iria tu nuevo nivel
    }
    //if (spot === "3") {
      //cambiarPantalla(islandScreen, matchScreen2);  // Nivel 3
    //}
	
    //cambiarPantalla(islandScreen, levelScreen);
  });
});

	
	function actualizarIslas() {
  document.querySelectorAll(".island").forEach(isla => {
    const spot = isla.dataset.spot;

    if ((spot === "2" || spot === "3") && !nivel1Completado) {
      isla.classList.add("locked");
    } else {
      isla.classList.remove("locked");
    }
  });
}

// Llamar al cargar el mapa
actualizarIslas();


	const btnVolver = document.getElementById("btnVolver");
	btnVolver.addEventListener("click", () => {
	cambiarPantalla(islandScreen, menu);
	});

// ==========================
// CUARTA PANTALLA - DRAG & DROP
// ==========================
const levelScreen = document.getElementById("levelScreen");
const levelMessage = document.getElementById("levelMessage");
const levelProgressFill = document.getElementById("levelProgressFill");
let draggedLetter = null;
let intentosFallidos = 0;
const limiteFallos = 5;
let aciertos = 0;
const total = document.querySelectorAll(".level-img").length;
// Arrastrar letras
document.querySelectorAll(".level-word").forEach(el => {
  el.addEventListener("dragstart", () => {
    draggedWord = el.dataset.word;
  });
});
// Soltar sobre imagenes
document.querySelectorAll(".level-img").forEach(img => {
  img.addEventListener("dragover", e => e.preventDefault());

  img.addEventListener("drop", () => {
    if (intentosFallidos >= limiteFallos) return;

    //CORRECTO
    if (img.dataset.word === draggedWord) {
      levelMessage.innerHTML = "Muy bien!";
      aciertos++;
	  sumarRecompensa(5, 3); // 10 puntos, 5 monedas 

      // marcar visualmente la union
      img.style.borderColor = "limegreen";
      document.querySelector(`.level-word[data-word="${draggedWord}"]`).style.opacity = "0.5";
      document.querySelector(`.level-word[data-word="${draggedWord}"]`).draggable = false;

      // progreso
      const progreso = Math.round((aciertos / total) * 100);
      levelProgressFill.style.width = progreso + "%";

      // si completo todo
      if (aciertos === total) {
        setTimeout(() => {
          cambiarPantalla(levelScreen, matchScreen);
        }, 1000);
      }

    } else {
      // INCORRECTO
      playError();
      intentosFallidos++;
      levelMessage.innerHTML = `Sigue intentando  (${intentosFallidos}/${limiteFallos})`;

      if (intentosFallidos >= limiteFallos) {
        mostrarRespuestaCorrecta();
      }
    }
  });
});

// Mostrar soluci贸n tras 5 fallos
function mostrarRespuestaCorrecta() {
  levelMessage.innerHTML = `
    <div style="
      background:white;
      border:4px solid red;
      padding:15px;
      border-radius:12px;
      font-size:22px;
    ">
      Has superado los ${limiteFallos} intentos <br>
      <b>La respuesta correcta era unir cada imagen con su palabra.</b>
    </div>
  `;

  // bloquear
  document.querySelectorAll(".level-word").forEach(el => {
    el.draggable = false;
    el.style.opacity = "0.3";
  });

  document.querySelectorAll(".level-img").forEach(img => {
    img.style.pointerEvents = "none";
  });

  setTimeout(() => {
    cambiarPantalla(levelScreen, matchScreen);
	}, 5000);
} 

// boton volver
document.getElementById("btnLevelBack").addEventListener("click", () => {
  cambiarPantalla(levelScreen, islandScreen);
});


  document.addEventListener("DOMContentLoaded", () => {
  // ===============================
  //     PANTALLA 5 - MATCH GAME
  // ===============================
  let draggedWord = null;
  let fallos = 0;
  const limiteFallos = 5;
  const matchMessage = document.getElementById("matchMessage");
  document.querySelectorAll(".match-word").forEach(word => {
    word.addEventListener("dragstart", () => {
      draggedWord = word.dataset.word;
    });
  });
  document.querySelectorAll(".match-img").forEach(img => {
    img.addEventListener("dragover", e => e.preventDefault());
    img.addEventListener("drop", () => {
      // CORRECTO
      if (img.dataset.word === draggedWord) {
        matchMessage.innerHTML = "Muy bien!";
		 sumarRecompensa(5, 3); // 10 puntos, 5 monedas
        img.style.border = "4px solid lime";
        img.style.background = "rgba(0,255,0,0.25)";
        img.style.pointerEvents = "none"; // bloquear imagen
        const palabraCorrecta = document.querySelector(
          `.match-word[data-word='${draggedWord}']`
        );
        palabraCorrecta.style.opacity = "0.3";
        palabraCorrecta.draggable = false;
        palabraCorrecta.style.cursor = "default";
        // Verificar si termino
        let faltan = 0;
        document.querySelectorAll(".match-word").forEach(w => {
          if (w.draggable) faltan++;
        });
        if (faltan === 0) {
          setTimeout(() => {
            cambiarPantalla(matchScreen, matchScreen2);
          }, 1200);
        }
      } 
      else {    //INCORRECTO
	    //playError(); // SONIDO DE ERROR 
        fallos++;
        matchMessage.innerHTML = "Sigue intentando";
        if (fallos >= limiteFallos) {
          mostrarRespuestaCorrecta();
        }
      }
    });
  });  
  function dibujarLineasCorrectas() {

  const svg = document.getElementById("matchLines");
  const screen = document.getElementById("matchScreen");

  const rect = screen.getBoundingClientRect();

  svg.setAttribute("width", rect.width);
  svg.setAttribute("height", rect.height);
  svg.setAttribute("viewBox", `0 0 ${rect.width} ${rect.height}`);
  svg.innerHTML = "";
  svg.style.display = "block";

  document.querySelectorAll(".match-img").forEach(img => {

    const palabra = img.dataset.word;
    const wordEl = document.querySelector(
      `.match-word[data-word='${palabra}']`
    );

    if (!wordEl) return;

    const imgRect = img.getBoundingClientRect();
    const wordRect = wordEl.getBoundingClientRect();

    const x1 = imgRect.right - rect.left;
    const y1 = imgRect.top + imgRect.height / 2 - rect.top;

    const x2 = wordRect.left - rect.left;
    const y2 = wordRect.top + wordRect.height / 2 - rect.top;

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");

    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    line.setAttribute("stroke", "red");
    line.setAttribute("stroke-width", "4");
    line.setAttribute("stroke-dasharray", "6,4");

    svg.appendChild(line);
  });
}

  // ===============================
  // MOSTRAR RESPUESTA CORRECTA
  // ===============================
  function mostrarRespuestaCorrecta() {
    matchMessage.innerHTML = `
      Has superado los ${limiteFallos} intentos <br>
      <strong>La respuesta correcta es:</strong>
    `;  
	matchMessage.style.background = "#fff";
	matchMessage.style.border = "4px solid red";
	matchMessage.style.padding = "15px";
	matchMessage.style.borderRadius = "15px";
	dibujarLineasCorrectas(); // AQU
	document.querySelectorAll(".match-img").forEach(img => {
    img.style.pointerEvents = "none";
  });
  document.querySelectorAll(".match-word").forEach(word => {
    word.draggable = false;
  });
  setTimeout(() => {
    cambiarPantalla(matchScreen, matchScreen2);
  }, 5000);
}
}); 

// ===============================
//     PANTALLA 6 - MATCH GAME 2
// ===============================
document.addEventListener("DOMContentLoaded", () => {

  let draggedWord2 = null;
  let fallos2 = 0;
  const limiteFallos2 = 5;

  const matchScreen2 = document.getElementById("matchScreen2");
  const matchMessage2 = document.getElementById("matchMessage2");
  const svgLines = document.getElementById("matchLines2");

  // Arrastrar palabras
  document.querySelectorAll(".match-word2").forEach(word => {
    word.addEventListener("dragstart", () => {
      draggedWord2 = word.dataset.word;
    });
  });

  // Soltar sobre imagenes
  document.querySelectorAll("#matchScreen2 .match-img").forEach(img => {

    img.addEventListener("dragover", e => e.preventDefault());

    img.addEventListener("drop", () => {

      // CORRECTO
      if (img.dataset.word === draggedWord2) {

        matchMessage2.innerHTML = "Muy bien!";
         sumarRecompensa(5, 3); // 10 puntos, 5 monedas
        img.style.border = "4px solid lime";
        img.style.background = "rgba(0,255,0,0.3)";
        img.style.pointerEvents = "none";

        const palabraCorrecta = document.querySelector(
          `.match-word2[data-word='${draggedWord2}']`
        );

        palabraCorrecta.style.opacity = "0.3";
        palabraCorrecta.draggable = false;
        palabraCorrecta.style.cursor = "default";

        // Verificar si ya termina todo
        let faltan = 0;
        document.querySelectorAll(".match-word2").forEach(w => {
          if (w.draggable) faltan++;
        });

        // TODO CORRECTO PASAR A SCREEN 7
        if (faltan === 0) {
          setTimeout(() => {
            cambiarPantalla(matchScreen2, screen7);
          }, 1000);
        }

      }
      //INCORRECTO
      else {
	    playError(); // SONIDO DE ERROR
        fallos2++;
        matchMessage2.innerHTML = "Sigue intentando";

        if (fallos2 >= limiteFallos2) {
          mostrarRespuestaCorrecta2();
        }
      }
    });
  });

  // ===============================
  // MOSTRAR RESPUESTAS CORRECTAS
  // ===============================
  function mostrarRespuestaCorrecta2() {

    matchMessage2.innerHTML = `
      Has superado los ${limiteFallos2} intentos <br>
      <strong>Observa las respuestas correctas</strong>
    `;

    matchMessage2.style.background = "#fff";
    matchMessage2.style.border = "4px solid red";
    matchMessage2.style.padding = "15px";
    matchMessage2.style.borderRadius = "15px";

    dibujarLineasCorrectas2();

    // Bloquear interaccion
    document.querySelectorAll("#matchScreen2 .match-img").forEach(img => {
      img.style.pointerEvents = "none";
    });

    document.querySelectorAll(".match-word2").forEach(word => {
      word.draggable = false;
    });

    // Esperar 5 segundos y avanzar
    setTimeout(() => {
      cambiarPantalla(matchScreen2, screen7);
    }, 5000);
  }

  // ===============================
  // DIBUJAR LiNEAS ROJAS
  // ===============================
  function dibujarLineasCorrectas2() {

    const rect = matchScreen2.getBoundingClientRect();

    svgLines.setAttribute("width", rect.width);
    svgLines.setAttribute("height", rect.height);
    svgLines.setAttribute("viewBox", `0 0 ${rect.width} ${rect.height}`);
    svgLines.innerHTML = "";
    svgLines.style.display = "block";
    svgLines.style.position = "absolute";
    svgLines.style.top = "0";
    svgLines.style.left = "0";
    svgLines.style.pointerEvents = "none";

    document.querySelectorAll("#matchScreen2 .match-img").forEach(img => {

      const palabra = img.dataset.word;
      const wordEl = document.querySelector(
        `.match-word2[data-word='${palabra}']`
      );

      if (!wordEl) return;

      const imgRect = img.getBoundingClientRect();
      const wordRect = wordEl.getBoundingClientRect();

      const x1 = imgRect.right - rect.left;
      const y1 = imgRect.top + imgRect.height / 2 - rect.top;

      const x2 = wordRect.left - rect.left;
      const y2 = wordRect.top + wordRect.height / 2 - rect.top;

      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");

      line.setAttribute("x1", x1);
      line.setAttribute("y1", y1);
      line.setAttribute("x2", x2);
      line.setAttribute("y2", y2);
      line.setAttribute("stroke", "red");
      line.setAttribute("stroke-width", "4");
      line.setAttribute("stroke-dasharray", "6,4");

      svgLines.appendChild(line);
    });
  }

});


	// Evitar que los cofres tengan estilos de match-img
	document.querySelectorAll("#screen7 .cofre-img").forEach(c => {
		c.classList.remove("match-img");
	});

		// ==========================
	//     PANTALLA 7 - COFRES
	// ==========================

	let totalPalabras7 = document.querySelectorAll("#screen7 .word-item").length;
	let correctas7 = 0;
	let palabraArrastrada7 = null;

// Cuando la palabra empieza a arrastrarse
	document.querySelectorAll("#screen7 .word-item").forEach(item => {
    item.addEventListener("dragstart", e => {
        palabraArrastrada7 = item;
        e.dataTransfer.setData("type", item.dataset.type);
        e.dataTransfer.setData("text", item.innerText);
        setTimeout(() => item.style.opacity = "0.3", 50);
    });

    item.addEventListener("dragend", () => {
        item.style.opacity = "1";
    });
});

// Cofres reciben drop
	document.querySelectorAll("#screen7 .cofre-img").forEach(cofre => {

    cofre.addEventListener("dragover", e => e.preventDefault());

    cofre.addEventListener("drop", e => {
        const tipoPalabra = e.dataTransfer.getData("type");

        if (tipoPalabra === cofre.dataset.type) {
            // ----------------------------------
            //     RESPUESTA CORRECTA
            // ----------------------------------
            document.getElementById("mensajePantalla7").innerHTML = "Muy bien!";
             sumarRecompensa(5, 3); // 10 puntos, 5 monedas
            // Animacion
            cofre.classList.add("cofre-correcto");
            setTimeout(() => cofre.classList.remove("cofre-correcto"), 300);

            // Eliminar la palabra
            palabraArrastrada7.remove();
            correctas7++;

            // Termina todo?
            if (correctas7 === totalPalabras7) {
				setTimeout(() => {
					cambiarPantalla(screen7, screen8);
				}, 800);
			}
        } else {
		     playError(); //SONIDO DE ERROR
            // ----------------------------------
            //     RESPUESTA INCORRECTA
            // ----------------------------------
            document.getElementById("mensajePantalla7").innerHTML = "Sigue intentando";
            
            cofre.classList.add("cofre-incorrecto");
            setTimeout(() => cofre.classList.remove("cofre-incorrecto"), 300);
        }
    });
});

	// ========================================
	//        PANTALLA 8 - ROMPECABEZAS
	// ========================================
	let syllDragging = null;
	let completed8 = 0;
	let total8 = 4;

	// Arrastrar silabas
	document.querySelectorAll("#screen8 .p8-syl").forEach(syl => {
    syl.addEventListener("dragstart", e => {
        syllDragging = syl;
        syl.style.opacity = "0.5";
    });

    syl.addEventListener("dragend", e => {
        syl.style.opacity = "1";
    });
});

	// Soltar en casillas
	document.querySelectorAll("#screen8 .p8-drop").forEach(drop => {

    drop.addEventListener("dragover", e => e.preventDefault());

    drop.addEventListener("drop", e => {
        e.preventDefault();

        if (!syllDragging) return;

        let palabra = drop.dataset.word;

        let syllList = {
            "gato": ["ga", "to"],
            "hada": ["ha", "da"],
            "bebe": ["be", "bé"],
            "cama": ["ca", "ma"]
        };

        // concatenar silaba
        let silaba = syllDragging.dataset.syll;

        if (!drop.dataset.current) drop.dataset.current = "";

        drop.dataset.current += silaba;

        drop.innerHTML = drop.dataset.current;

        // Verificar si es correcto
        let meta = syllList[palabra].join("");

        if (drop.dataset.current === meta) {

            document.getElementById("silabasMsg").innerHTML = "Muy bien!";
             sumarRecompensa(5, 3); // 10 puntos, 5 monedas
            syllDragging.remove();
            drop.style.borderColor = "lime";
            completed8++;

            if (completed8 === total8) {
                setTimeout(() => {
                cambiarPantalla(screen8, screen9);  // si deseas continuar
                }, 800);
            }

        } else if (!meta.startsWith(drop.dataset.current)) {
            playError(); //SONIDO DE ERROR 
            document.getElementById("silabasMsg").innerHTML = "Sigue intentando";

            drop.dataset.current = "";
            drop.innerHTML = "";
        }
    });
});

	// ========================================
	//        PANTALLA 9 - ROMPECABEZAS
	// ========================================
	let syllDragging1 = null;
	let completed9 = 0;
	let total9 = 4;

	// Arrastrar silabas
	document.querySelectorAll("#screen9 .p9-syl").forEach(syl => {
    syl.addEventListener("dragstart", e => {
        syllDragging1 = syl;
        syl.style.opacity = "0.5";
    });

    syl.addEventListener("dragend", e => {
        syl.style.opacity = "1";
    });
});

	// Soltar en casillas
	document.querySelectorAll("#screen9 .p9-drop").forEach(drop => {

    drop.addEventListener("dragover", e => e.preventDefault());

    drop.addEventListener("drop", e => {
        e.preventDefault();

        if (!syllDragging1) return;

        let palabra = drop.dataset.word;

        let syllList = {
            "hoja": ["ho", "ja"],
            "jugo": ["ju", "go"],
            "cuna": ["cu", "na"],
            "dona": ["do", "na"]
        };

        // concatenar silaba
        let silaba = syllDragging1.dataset.syll;

        if (!drop.dataset.current) drop.dataset.current = "";

        drop.dataset.current += silaba;

        drop.innerHTML = drop.dataset.current;

        // Verificar si es correcto
        let meta = syllList[palabra].join("");

        if (drop.dataset.current === meta) {

            document.getElementById("silabasMsg9").innerHTML = "Muy bien!";
             sumarRecompensa(5, 3); // 10 puntos, 5 monedas
            syllDragging1.remove();
            drop.style.borderColor = "lime";
            completed9++;

            if (completed9 === total9) {
                setTimeout(() => {
                   // alert("Nivel completado");
                     cambiarPantalla(screen9, screen10);  // si deseas continuar
                }, 800);
            }

        } else if (!meta.startsWith(drop.dataset.current)) {
            playError(); //SONIDO DE ERROR
            document.getElementById("silabasMsg9").innerHTML = "Sigue intentando";

            drop.dataset.current = "";
            drop.innerHTML = "";
        }
    });
});

// ===============================
//     PANTALLA 10 - SELECCION
// ===============================
document.querySelectorAll("#screen10 .option-btn").forEach(btn => {
  btn.addEventListener("click", () => {

    if (btn.dataset.correct === "true") {

      document.getElementById("msg10").innerHTML = "Muy bien!";
        sumarRecompensa(5, 3); // 10 puntos, 5 monedas
      setTimeout(() => {
        //alert("Nivel completado");
        // aqui puedes pasar a screen11 si deseas
         cambiarPantalla(screen10, screen11);
      }, 1000);

    } else {
	  playError(); //SONIDO DE ERROR
      document.getElementById("msg10").innerHTML = "Sigue intentando";
    }
  });
});

// ===============================
//     PANTALLA 11 - DRAG FRASE
// ===============================
let dragWord11 = null;

document.querySelectorAll("#screen11 .phrase-drag").forEach(word => {

  word.addEventListener("dragstart", () => {
    dragWord11 = word;
    word.style.opacity = "0.5";
  });

  word.addEventListener("dragend", () => {
    word.style.opacity = "1";
  });
});

const drop11 = document.getElementById("drop11");

drop11.addEventListener("dragover", e => e.preventDefault());

drop11.addEventListener("drop", e => {
  e.preventDefault();

  if (!dragWord11) return;

  let correct = drop11.dataset.answer;
  let selected = dragWord11.dataset.word;

  if (selected === correct) {

    drop11.innerHTML = dragWord11.innerHTML;
    drop11.style.borderColor = "lime";

    dragWord11.remove();
    sumarRecompensa(5, 3);
    document.getElementById("msg11").innerHTML = "Muy bien!";

    setTimeout(() => {
      //alert("Nivel completado");
       cambiarPantalla(screen11, screen12);
    }, 1000);

  } else {
    playError(); //SONIDO DE ERROR 
    document.getElementById("msg11").innerHTML = "Sigue intentando";
  }
});

// ========================================
// PANTALLA 12 - ORDENAR ORACION (MEJORADO)
// ========================================

let palabraArrastrada = null;
let oracionActual = [];

const oracionCorrecta = ["ella", "corre", "en", "el", "parque"];

document.querySelectorAll("#screen12 .word").forEach(word => {

  word.addEventListener("dragstart", () => {
    palabraArrastrada = word;
    word.style.opacity = "0.5";
  });

  word.addEventListener("dragend", () => {
    word.style.opacity = "1";
  });

});

const drop12 = document.getElementById("oracionDrop");
const msg12 = document.getElementById("msg12");

drop12.addEventListener("dragover", e => e.preventDefault());

drop12.addEventListener("drop", () => {

  if (!palabraArrastrada) return;

  const palabra = palabraArrastrada.dataset.word;

  const posicion = oracionActual.length;

  // Validar paso a paso
  if (palabra === oracionCorrecta[posicion]) {

    oracionActual.push(palabra);
    drop12.innerHTML = oracionActual.join(" ");

    palabraArrastrada.remove();
    palabraArrastrada = null;
    sumarRecompensa(5, 3);
    msg12.innerHTML = "Muy bien!";

    //  Si completo toda la oracion
    if (oracionActual.length === oracionCorrecta.length) {
      setTimeout(() => {
        alert("Actividad completada");
         cambiarPantalla(screen12, screen13);
      }, 800);
    }

  } else {
    playError(); // SONIDO DE ERROR  
    // Error
    msg12.innerHTML = "Sigue intentando";
  }
});

// ========================================
// PANTALLA 13 - ORDENAR ORACION (MEJORADO)
// ========================================

let palabraArrastrada2 = null;
let oracionActual2 = [];

const oracionCorrecta2 = ["yo", "uso", "la", "computadora", "en", "el", "parque"];

document.querySelectorAll("#screen13 .word").forEach(word => {

  word.addEventListener("dragstart", () => {
    palabraArrastrada2 = word;
    word.style.opacity = "0.5";
  });

  word.addEventListener("dragend", () => {
    word.style.opacity = "1";
  });

});

const drop13 = document.getElementById("oracion2Drop");
const msg13 = document.getElementById("msg13");

drop13.addEventListener("dragover", e => e.preventDefault());

drop13.addEventListener("drop", () => {

  if (!palabraArrastrada2) return;

  const palabra2 = palabraArrastrada2.dataset.word;

  const posicion2 = oracionActual2.length;

  // Validar paso a paso
  if (palabra2 === oracionCorrecta2[posicion2]) {

    oracionActual2.push(palabra2);
    drop13.innerHTML = oracionActual2.join(" ");

    palabraArrastrada2.remove();
    palabraArrastrada2 = null;
    sumarRecompensa(5, 3);
    msg13.innerHTML = "Muy bien!";

    //  Si completo toda la oracion
    //if (oracionActual2.length === oracionCorrecta2.length) {
      //setTimeout(() => {
        ///alert("Actividad completada");
         //cambiarPantalla(screen13, islandScreen);
      //}, 800);
    //}
   //  Si completo toda la oracion
	if (oracionActual2.length === oracionCorrecta2.length) {
	  setTimeout(() => {

		//  Marcar Nivel 1 como completado
		nivel1Completado = true;

		//  Actualizar estado de las islas
		actualizarIslas();

		msg13.innerHTML = "Nivel completado!";

		// Volver al mapa con la isla 2 desbloqueada
		cambiarPantalla(screen13, islandScreen);

	  }, 1000);
	}
  } else {
     playError(); // SONIDO DE ERROR  
    // Error
    msg13.innerHTML = "Sigue intentando";
  }
});
  // ========================================
// PANTALLA 14 - ORDENAR FRASE
// ========================================

let palabraArrastrada14 = null;
let fraseActual14 = [];
let intentos14 = 0;
const limiteIntentos14 = 5;

const fraseCorrecta14 = ["Buscar", "Un", "Tesoro"];

const msg14 = document.getElementById("msg14");
const slots14 = document.querySelectorAll("#screen14 .slot");

// Arrastrar palabras
document.querySelectorAll("#screen14 .word").forEach(word => {

  word.addEventListener("dragstart", () => {
    palabraArrastrada14 = word;
    word.style.opacity = "0.5";
  });

  word.addEventListener("dragend", () => {
    word.style.opacity = "1";
  });

});

// Soltar en cajones
slots14.forEach(slot => {

  slot.addEventListener("dragover", e => e.preventDefault());

  slot.addEventListener("drop", () => {

    if (!palabraArrastrada14) return;

    const palabra = palabraArrastrada14.dataset.word;
    const posicion = fraseActual14.length;

    // Validacion paso a paso
    if (palabra === fraseCorrecta14[posicion]) {

      slot.textContent = palabra;
      fraseActual14.push(palabra);

      palabraArrastrada14.remove();
      palabraArrastrada14 = null;
	  sumarRecompensa(5, 3);
      msg14.innerHTML = "Muy bien!";

      // Frase completa
      if (fraseActual14.length === fraseCorrecta14.length) {
        setTimeout(() => {
          cambiarPantalla(screen14, screen15);
        }, 1200);
      }

    } else {
      playError(); // SONIDO DE ERROR    
      intentos14++;
      msg14.innerHTML = `Sigue intentando  (${intentos14}/${limiteIntentos14})`;

      // Si supera intentos
      if (intentos14 >= limiteIntentos14) {
        mostrarRespuestaCorrecta14();
      }
    }

  });

});

// Mostrar solucion y avanzar
function mostrarRespuestaCorrecta14() {

  // Bloquear palabras
  document.querySelectorAll("#screen14 .word").forEach(w => {
    w.draggable = false;
    w.style.opacity = "0.4";
    w.style.cursor = "default";
  });

  msg14.innerHTML = `
    <div style="
      background:white;
      border:4px solid red;
      border-radius:15px;
      padding:15px;
      font-size:22px;
    ">
       Has superado los intentos<br>
      <b>La respuesta correcta es:</b><br>
      Buscar Un Tesoro
    </div>
  `;

  // 鈴?Esperar 5s y avanzar
  setTimeout(() => {
    cambiarPantalla(screen14, screen15);
  }, 5000);
}

// ========================================
// PANTALLA 15 - ORDENAR FRASE
// ========================================

let palabraArrastrada15 = null;
let fraseActual15 = [];

const fraseCorrecta15 = ["escribir", "en", "el", "pergamino"];

const drop15 = document.getElementById("drop15");
const msg15 = document.getElementById("msg15");

// Arrastrar palabras
document.querySelectorAll("#screen15 .word").forEach(word => {

  word.addEventListener("dragstart", () => {
    palabraArrastrada15 = word;
    word.style.opacity = "0.5";
  });

  word.addEventListener("dragend", () => {
    word.style.opacity = "1";
  });

});

// Permitir soltar
drop15.addEventListener("dragover", e => e.preventDefault());

drop15.addEventListener("drop", () => {

  if (!palabraArrastrada15) return;

  const palabra = palabraArrastrada15.dataset.word;
  const posicion = fraseActual15.length;

  // Validacion paso a paso
  if (palabra === fraseCorrecta15[posicion]) {

    fraseActual15.push(palabra);
    drop15.innerHTML = fraseActual15.join(" ");

    palabraArrastrada15.remove();
    palabraArrastrada15 = null;
    sumarRecompensa(5, 3);
    msg15.innerHTML = "Muy bien!";

    // Frase completa
    if (fraseActual15.length === fraseCorrecta15.length) {
      setTimeout(() => {
        alert("Actividad completada");
         cambiarPantalla(screen15, screen16); // futura pantalla
      }, 800);
    }

  } else {
     playError(); //SONIDO DE ERROR  
    //Error
    msg15.innerHTML = "Sigue intentando";
  }
});

// ========================================
// PANTALLA 16 - ASOCIAR IMAGENES Y FRASES
// ========================================

let fraseArrastrada16 = null;

document.querySelectorAll("#screen16 .frase").forEach(frase => {
  frase.addEventListener("dragstart", () => {
    fraseArrastrada16 = frase;
    frase.style.opacity = "0.5";
  });

  frase.addEventListener("dragend", () => {
    frase.style.opacity = "1";
  });
});

document.querySelectorAll("#screen16 .drop-zona").forEach(zona => {

  zona.addEventListener("dragover", e => e.preventDefault());

  zona.addEventListener("drop", () => {

    if (!fraseArrastrada16) return;

    const imagen = zona.parentElement;
    const respuestaCorrecta = imagen.dataset.answer;
    const frase = fraseArrastrada16.dataset.frase;

    if (respuestaCorrecta === frase) {

      zona.textContent = fraseArrastrada16.textContent;
      fraseArrastrada16.classList.add("correcta");
      fraseArrastrada16.draggable = false;

      fraseArrastrada16.remove();
      fraseArrastrada16 = null;
      sumarRecompensa(5, 3);
      verificarPantalla16();

    } else {
	  playError(); // SONIDO DE ERROR  
      document.getElementById("msg16").innerHTML = "Sigue intentando";
    }
  });
});

function verificarPantalla16() {
  const restantes = document.querySelectorAll("#screen16 .frase").length;

  if (restantes === 0) {
    document.getElementById("msg16").innerHTML = "Muy bien!";
    setTimeout(() => {
       cambiarPantalla(screen16, screen17); // siguiente nivel
    }, 1000);
  }
}

// ========================================
// PANTALLA 17 - ASOCIAR IMAGENES Y PALABRAS
// ========================================

let fraseArrastrada17 = null;

document.querySelectorAll("#screen17 .frase").forEach(frase => {
  frase.addEventListener("dragstart", () => {
    fraseArrastrada17 = frase;
    frase.style.opacity = "0.5";
  });

  frase.addEventListener("dragend", () => {
    frase.style.opacity = "1";
  });
});

document.querySelectorAll("#screen17 .drop-zona").forEach(zona => {

  zona.addEventListener("dragover", e => e.preventDefault());

  zona.addEventListener("drop", () => {

    if (!fraseArrastrada17) return;

    const imagen = zona.parentElement;
    const respuestaCorrecta = imagen.dataset.answer;
    const palabra = fraseArrastrada17.dataset.frase;

    if (respuestaCorrecta === palabra) {

      zona.textContent = fraseArrastrada17.textContent;
      fraseArrastrada17.classList.add("correcta");
      fraseArrastrada17.draggable = false;

      fraseArrastrada17.remove();
      fraseArrastrada17 = null;
      sumarRecompensa(5, 3);
      verificarPantalla17();

    } else {
	  playError(); // SONIDO DE ERROR  
      document.getElementById("msg17").innerHTML = "Sigue intentando";
    }
  });
});

function verificarPantalla17() {
  const restantes = document.querySelectorAll("#screen17 .frase").length;

  if (restantes === 0) {
    document.getElementById("msg17").innerHTML = "Muy bien!";

    setTimeout(() => {
       cambiarPantalla(screen17, screen18); // siguiente pantalla
    }, 1200);
  }
}

// ========================================
// PANTALLA 18 - ASOCIAR IMAGENES Y PALABRAS
// ========================================

let fraseArrastrada18 = null;

document.querySelectorAll("#screen18 .frase").forEach(frase => {
  frase.addEventListener("dragstart", () => {
    fraseArrastrada18 = frase;
    frase.style.opacity = "0.5";
  });

  frase.addEventListener("dragend", () => {
    frase.style.opacity = "1";
  });
});

document.querySelectorAll("#screen18 .drop-zona").forEach(zona => {

  zona.addEventListener("dragover", e => e.preventDefault());

  zona.addEventListener("drop", () => {

    if (!fraseArrastrada18) return;

    const imagen = zona.parentElement;
    const correcta = imagen.dataset.answer;
    const palabra = fraseArrastrada18.dataset.frase;

    if (correcta === palabra) {

      zona.textContent = fraseArrastrada18.textContent;
      fraseArrastrada18.draggable = false;
      fraseArrastrada18.remove();
      fraseArrastrada18 = null;
      sumarRecompensa(5, 3);
      verificarPantalla18();

    } else {
	   playError(); // SONIDO DE ERROR  
      document.getElementById("msg18").innerHTML = "Sigue intentando";
    }
  });
});

function verificarPantalla18() {
  const restantes = document.querySelectorAll("#screen18 .frase").length;

  if (restantes === 0) {
    document.getElementById("msg18").innerHTML = "Muy bien!";

    setTimeout(() => {
       cambiarPantalla(screen18, screen19);
      // o regresar al mapa / final del nivel
    }, 1200);
  }
}

// =================================
// PANTALLA 19 - UNIR IDEAS (FIX)
// =================================

let seleccionActual = null;
let aciertos19 = 0;
const totalParejas19 = 3;

const msg19 = document.getElementById("msg19");

document.querySelectorAll("#screen19 .item").forEach(item => {

  item.addEventListener("click", () => {

    // No permitir interacci贸n si ya es correcto
    if (item.classList.contains("correcto")) return;

    // PRIMER CLIC
    if (!seleccionActual) {
      seleccionActual = item;
      item.classList.add("seleccionado");
      return;
    }

    // Evitar seleccionar el mismo elemento
    if (seleccionActual === item) return;

    // Evitar seleccionar dos del mismo lado
    const lado1 = seleccionActual.parentElement.classList.contains("izquierda");
    const lado2 = item.parentElement.classList.contains("izquierda");

    if (lado1 === lado2) {
      seleccionActual.classList.remove("seleccionado");
      seleccionActual = item;
      item.classList.add("seleccionado");
      return;
    }

    // VALIDACION
    const id1 = seleccionActual.dataset.id;
    const id2 = item.dataset.id;

    if (id1 === id2) {
      // CORRECTO
      seleccionActual.classList.add("correcto");
      item.classList.add("correcto");

      seleccionActual.classList.remove("seleccionado");

      // Bloquear ambos
      seleccionActual.style.pointerEvents = "none";
      item.style.pointerEvents = "none";

      seleccionActual = null;
      aciertos19++;

      msg19.textContent = "Muy bien!";

      // COMPLET脫 TODAS
      if (aciertos19 === totalParejas19) {
	    sumarRecompensa(5, 3);
	    msg19.textContent = "Muy bien!";
        msg19.classList.add("visible");
		
        setTimeout(() => {
          msg19.textContent = "Excelente trabajo!";
        }, 1200);

        setTimeout(() => {
		  msg19.classList.remove("visible");
          cambiarPantalla(screen19, screen20);
        }, 2500);
      //}

      } else {
	     playError(); // SONIDO DE ERROR  
        // INCORRECTO
        msg19.textContent = "Sigue intentando";
        //seleccionActual.classList.remove("seleccionado");
       //seleccionActual = null;
      }
	}
  });
});

// =================================
// PANTALLA 20 - ELEGIR CONECTOR
// =================================

let palabraArrastrada20 = null;
const correcta20 = "porque";

document.querySelectorAll("#screen20 .word").forEach(word => {

  word.addEventListener("dragstart", () => {
    palabraArrastrada20 = word;
    word.style.opacity = "0.5";
  });

  word.addEventListener("dragend", () => {
    word.style.opacity = "1";
  });

});

const drop20 = document.getElementById("drop20");
const msg20 = document.getElementById("msg20");

drop20.addEventListener("dragover", e => e.preventDefault());

drop20.addEventListener("drop", () => {

  if (!palabraArrastrada20) return;

  const palabra = palabraArrastrada20.dataset.word;

  if (palabra === correcta20) {
    
    sumarRecompensa(5, 3); 	
    drop20.textContent = palabraArrastrada20.textContent;
    msg20.textContent = "Muy bien!";

    palabraArrastrada20.remove();
    palabraArrastrada20 = null;

    // Avanzar a siguiente pantalla (si existe)
    setTimeout(() => {
       cambiarPantalla(screen20, screen21);
    }, 1500);

  } else {
     playError(); // SONIDO DE ERROR  
    msg20.textContent = "Sigue intentando";
    palabraArrastrada20 = null;
  }
});

// =================================
// PANTALLA 21 - ELEGIR CONECTOR
// =================================

let palabraArrastrada21 = null;
const correcta21 = "pero";

document.querySelectorAll("#screen21 .word").forEach(word => {

  word.addEventListener("dragstart", () => {
    palabraArrastrada21 = word;
    word.style.opacity = "0.5";
  });

  word.addEventListener("dragend", () => {
    word.style.opacity = "1";
  });

});

const drop21 = document.getElementById("drop21");
const msg21 = document.getElementById("msg21");

drop21.addEventListener("dragover", e => e.preventDefault());

drop21.addEventListener("drop", () => {

  if (!palabraArrastrada21) return;

  const palabra = palabraArrastrada21.dataset.word;

  if (palabra === correcta21) {
    sumarRecompensa(5, 3);
    drop21.textContent = palabraArrastrada21.textContent;
    msg21.textContent = "Muy bien!";

    palabraArrastrada21.remove();
    palabraArrastrada21 = null;

    //Avanzar a siguiente pantalla (si existe)
    setTimeout(() => {
       cambiarPantalla(screen21, screen22);
    }, 1500);

  } else {
     playError(); //SONIDO DE ERROR  
    msg21.textContent = "Sigue intentando";
    palabraArrastrada21 = null;
  }
});

// =================================
// PANTALLA 22 - ELEGIR CONECTOR
// =================================

let palabraArrastrada22 = null;
const correcta22 = "Ademas";

document.querySelectorAll("#screen22 .word").forEach(word => {

  word.addEventListener("dragstart", () => {
    palabraArrastrada22 = word;
    word.style.opacity = "0.5";
  });

  word.addEventListener("dragend", () => {
    word.style.opacity = "1";
  });

});

const drop22 = document.getElementById("drop22");
const msg22 = document.getElementById("msg22");

drop22.addEventListener("dragover", e => e.preventDefault());

drop22.addEventListener("drop", () => {

  if (!palabraArrastrada22) return;

  const palabra = palabraArrastrada22.dataset.word;

  if (palabra === correcta22) {
    sumarRecompensa(5, 3);
    drop22.textContent = palabraArrastrada22.textContent;
    msg22.textContent = "Muy bien!";

    palabraArrastrada22.remove();
    palabraArrastrada22 = null;

    // Avanzar a siguiente pantalla (si existe)
    setTimeout(() => {
       cambiarPantalla(screen22, screen23);
    }, 1500);

  } else {
    playError(); // SONIDO DE ERROR  
    msg22.textContent = "Sigue intentando";
    palabraArrastrada22 = null;
  }
});

// =================================
// PANTALLA 23 - ELEGIR CONECTOR
// =================================

let palabraArrastrada23 = null;
const correcta23 = "Por eso";

document.querySelectorAll("#screen23 .word").forEach(word => {

  word.addEventListener("dragstart", () => {
    palabraArrastrada23 = word;
    word.style.opacity = "0.5";
  });

  word.addEventListener("dragend", () => {
    word.style.opacity = "1";
  });

});

const drop23 = document.getElementById("drop23");
const msg23 = document.getElementById("msg23");

drop23.addEventListener("dragover", e => e.preventDefault());

drop23.addEventListener("drop", () => {

  if (!palabraArrastrada23) return;

  const palabra = palabraArrastrada23.dataset.word;

  if (palabra === correcta23) {
    sumarRecompensa(5, 3);
    drop23.textContent = palabraArrastrada23.textContent;
    msg23.textContent = "Muy bien!";

    palabraArrastrada23.remove();
    palabraArrastrada23 = null;

    // Avanzar a siguiente pantalla (si existe)
    setTimeout(() => {
       cambiarPantalla(screen23, screen24);
    }, 1500);

  } else {
    playError(); //  SONIDO DE ERROR 
    msg23.textContent = "Sigue intentando";
    palabraArrastrada23 = null;
  }
});

// =================================
// PANTALLA 24 - ELEGIR CONECTOR
// =================================
let palabraArrastrada24 = null;
const correcta24 = "En primer lugar";
const screen24 = document.getElementById("screen24");
document.querySelectorAll("#screen24 .word").forEach(word => {
  word.addEventListener("dragstart", () => {
    palabraArrastrada24 = word;
    word.style.opacity = "0.5";
  });
  word.addEventListener("dragend", () => {
    word.style.opacity = "1";
  });
});
const drop24 = document.getElementById("drop24");
const msg24 = document.getElementById("msg24");
drop24.addEventListener("dragover", e => e.preventDefault());
drop24.addEventListener("drop", () => {
  if (!palabraArrastrada24) return;
  const palabra = palabraArrastrada24.dataset.word;
  if (palabra === correcta24) {
    drop24.textContent = palabraArrastrada24.textContent;
	sumarRecompensa(5, 3);
    msg24.textContent = "Muy bien!";
    palabraArrastrada24.remove();
    palabraArrastrada24 = null;
    // Avanzar a siguiente pantalla (si existe)
    setTimeout(() => {
       cambiarPantalla(screen24, screen25);
    }, 1500);
  } else {
    playError(); // SONIDO DE ERROR 
    msg24.textContent = "Sigue intentando";
    palabraArrastrada24 = null;
  }
});

// =================================
// PANTALLA 25 - ELEGIR CONECTOR
// =================================
let palabraArrastrada25 = null;
const correcta25 = "otras palabras";
const screen25 = document.getElementById("screen25");
document.querySelectorAll("#screen25 .word").forEach(word => {
  word.addEventListener("dragstart", () => {
    palabraArrastrada25 = word;
    word.style.opacity = "0.5";
  });
  word.addEventListener("dragend", () => {
    word.style.opacity = "1";
  });
});
const drop25 = document.getElementById("drop25");
const msg25 = document.getElementById("msg25");
drop25.addEventListener("dragover", e => e.preventDefault());
drop25.addEventListener("drop", () => {
  if (!palabraArrastrada25) return;
  const palabra = palabraArrastrada25.dataset.word;
  if (palabra === correcta25) {
    drop25.textContent = palabraArrastrada25.textContent;
	sumarRecompensa(5, 3); 
    msg25.textContent = "Muy bien!";
    palabraArrastrada25.remove();
    palabraArrastrada25 = null;
    // Avanzar a siguiente pantalla (si existe)
    setTimeout(() => {
       cambiarPantalla(screen25, screen26);
    }, 1500);
  } else {
    playError(); // SONIDO DE ERROR 
    msg25.textContent = "Sigue intentando";
    palabraArrastrada25 = null;
  }
});

// =================================
// PANTALLA 26 - COMPLETAR PRRAFO
// =================================

const respuesta26 = document.getElementById("respuesta26");
const btn26 = document.getElementById("btn26");
const msg26 = document.getElementById("msg26");

const correcta26 = "Luego";

btn26.addEventListener("click", () => {

  const valor = respuesta26.value.trim();

  if (valor.toLowerCase() === correcta26.toLowerCase()) {
    sumarRecompensa(5, 3); 
    msg26.textContent = "Muy bien!";
    msg26.style.color = "green";

    setTimeout(() => {
      const screen26 = document.getElementById("screen26");
      const screen27 = document.getElementById("screen27");
      cambiarPantalla(screen26, screen27);
    }, 1500);

  } else {
    playError(); // SONIDO DE ERROR 
    msg26.textContent = "Sigue intentando";
    msg26.style.color = "red";
  }

});

// =================================
// PANTALLA 27 - COMPLETAR PRRAFO
// =================================

const respuesta27 = document.getElementById("respuesta27");
const btn27 = document.getElementById("btn27");
const msg27 = document.getElementById("msg27");

const correcta27 = "Luego";

btn27.addEventListener("click", () => {

  const valor = respuesta27.value.trim();

  if (valor.toLowerCase() === correcta27.toLowerCase()) {
    sumarRecompensa(5, 3);
    msg27.textContent = "Muy bien!";
    msg27.style.color = "green";
	msg13.innerHTML = "Nivel completado!";
    setTimeout(() => {
      const screen27 = document.getElementById("screen27");
      const screen28 = document.getElementById("screen28");
      cambiarPantalla(screen27, islandScreen);
    }, 1500);

  } else {
    playError(); // SONIDO DE ERROR 
    msg27.textContent = "Sigue intentando";
    msg27.style.color = "red";
  }

});

// =================================
// PANTALLA 28 - COMPLETAR HISTORIA
// =================================

let palabraArrastrada28 = null;
let aciertos28 = 0;
const total28 = 3;

const msg28 = document.getElementById("msg28");

// Arrastrar palabras
document.querySelectorAll("#screen28 .word28").forEach(word => {

  word.addEventListener("dragstart", () => {
    palabraArrastrada28 = word;
    word.style.opacity = "0.5";
  });

  word.addEventListener("dragend", () => {
    word.style.opacity = "1";
  });

});

// Zonas de destino
document.querySelectorAll("#screen28 .drop28").forEach(drop => {

  drop.addEventListener("dragover", e => e.preventDefault());

  drop.addEventListener("drop", () => {

    if (!palabraArrastrada28) return;

    const palabra = palabraArrastrada28.dataset.word;
    const correcta = drop.dataset.correct;

    if (palabra === correcta) {

      drop.textContent = palabra;
      palabraArrastrada28.remove();

      palabraArrastrada28 = null;
      aciertos28++;
      sumarRecompensa(5, 3);
      msg28.textContent = "Muy bien!";

      // Si completa todo
      if (aciertos28 === total28) {
        setTimeout(() => {
          msg28.textContent = "Excelente trabajo!";
        }, 500);

        setTimeout(() => {
          cambiarPantalla(screen28, screen29); // siguiente pantalla
        }, 1500);
      }

    } else {
	  playError(); // SONIDO DE ERROR 
      msg28.textContent = "Sigue intentando";
      palabraArrastrada28 = null;
    }

  });

});

// =================================
// PANTALLA 29 - COMPLETAR HISTORIA
// =================================

let palabraArrastrada29 = null;
let aciertos29 = 0;
const total29 = 3;

const msg29 = document.getElementById("msg29");

// Arrastrar palabras
document.querySelectorAll("#screen29 .word29").forEach(word => {

  word.addEventListener("dragstart", () => {
    palabraArrastrada29 = word;
    word.style.opacity = "0.5";
  });

  word.addEventListener("dragend", () => {
    word.style.opacity = "1";
  });

});

// Zonas de destino
document.querySelectorAll("#screen29 .drop29").forEach(drop => {

  drop.addEventListener("dragover", e => e.preventDefault());

  drop.addEventListener("drop", () => {

    if (!palabraArrastrada29) return;

    const palabra = palabraArrastrada29.dataset.word;
    const correcta = drop.dataset.correct;

    if (palabra === correcta) {

      drop.textContent = palabra;
      palabraArrastrada29.remove();

      palabraArrastrada29 = null;
      aciertos29++;
      sumarRecompensa(5, 3);
      msg29.textContent = "Muy bien!";

      // Si completa todo
      if (aciertos29 === total29) {
        setTimeout(() => {
          msg29.textContent = "Excelente trabajo!";
        }, 500);

        setTimeout(() => {
          cambiarPantalla(screen29, screen30); // siguiente pantalla
        }, 1500);
      }

    } else {
	  playError(); // 馃攰 SONIDO DE ERROR 
      msg29.textContent = "Sigue intentando";
      palabraArrastrada29 = null;
    }

  });

});

// =================================
// PANTALLA 30 - COMPLETAR HISTORIA
// =================================

let palabraArrastrada30 = null;
let aciertos30 = 0;
const total30 = 1;

const screen30 = document.getElementById("screen30");
const screen31 = document.getElementById("screen31");
const msg30 = document.getElementById("msg30");

// Arrastrar palabras
document.querySelectorAll("#screen30 .word30").forEach(word => {

  word.addEventListener("dragstart", () => {
    palabraArrastrada30 = word;
    word.style.opacity = "0.5";
  });

  word.addEventListener("dragend", () => {
    word.style.opacity = "1";
  });

});

// Zonas de destino
document.querySelectorAll("#screen30 .drop30").forEach(drop => {

  drop.addEventListener("dragover", e => e.preventDefault());

  drop.addEventListener("drop", () => {

    if (!palabraArrastrada30) return;

    const palabra = palabraArrastrada30.dataset.word;
    const correcta = drop.dataset.correct;

    if (palabra === correcta) {

      drop.textContent = palabra;
      palabraArrastrada30.remove();

      palabraArrastrada30 = null;
      aciertos30++;
      sumarRecompensa(5, 3);
      msg30.textContent = "Muy bien!";

      // Si completa todo
      if (aciertos30 === total30) {
        setTimeout(() => {
          msg30.textContent = "Excelente trabajo!";
        }, 500);

        setTimeout(() => {
          cambiarPantalla(screen30, screen31); // siguiente pantalla
        }, 1500);
      }

    } else {
	  playError(); // SONIDO DE ERROR 
      msg30.textContent = "Sigue intentando";
      palabraArrastrada30 = null;
    }

  });

});

// =================================
// PANTALLA 31 - COMPLETAR HISTORIA
// =================================

let palabraArrastrada31 = null;
let aciertos31 = 0;
const total31 = 1;

const msg31 = document.getElementById("msg31");

// Arrastrar palabras
document.querySelectorAll("#screen31 .word31").forEach(word => {

  word.addEventListener("dragstart", () => {
    palabraArrastrada31 = word;
    word.style.opacity = "0.5";
  });

  word.addEventListener("dragend", () => {
    word.style.opacity = "1";
  });

});

// Zonas de destino
document.querySelectorAll("#screen31 .drop31").forEach(drop => {

  drop.addEventListener("dragover", e => e.preventDefault());

  drop.addEventListener("drop", () => {

    if (!palabraArrastrada31) return;

    const palabra = palabraArrastrada31.dataset.word;
    const correcta = drop.dataset.correct;

    if (palabra === correcta) { 

      drop.textContent = palabra;
      palabraArrastrada31.remove();

      palabraArrastrada31 = null;
      aciertos31++;
      sumarRecompensa(5, 3);
      msg31.textContent = "Muy bien!";

      // Si completa todo
      if (aciertos31 === total31) {
        setTimeout(() => {
          msg31.textContent = "Excelente trabajo!";
        }, 500);

        setTimeout(() => {
          cambiarPantalla(screen31, screen32); // siguiente pantalla
        }, 1500);
      }

    } else {
	  playError(); // SONIDO DE ERROR 
      msg31.textContent = "Sigue intentando";
      palabraArrastrada31 = null;
    }

  });

});

// =================================
// PANTALLA 32 - COMPLETAR PRRAFO
// =================================

const btn32 = document.getElementById("btn32");
const msg32 = document.getElementById("msg32");

const respuestas32 = {
  inp1: "primero",
  inp2: "luego",
  inp3: "despues",
  inp4: "tambien",
  inp5: "finalmente"
};

btn32.addEventListener("click", () => {

  let aciertos = 0;

  for (let id in respuestas32) {
    const input = document.getElementById(id);
    const valor = input.value.trim().toLowerCase();

    if (valor === respuestas32[id]) {
      input.style.borderBottom = "3px solid green";
      aciertos++;
    } else {
      input.style.borderBottom = "3px solid red";
    }
  }

  if (aciertos === 5) {
    sumarRecompensa(5, 3);
    msg32.textContent = "Muy bien!";

    setTimeout(() => {
      cambiarPantalla(screen32, screen33); // siguiente pantalla
    }, 1500);

  } else {
    playError(); // SONIDO DE ERROR 
    msg32.textContent = "Sigue intentando";
  }

});

// =================================
// PANTALLA 33 - PRRAFO CONECTORES
// =================================

function verificar33() {

  const r1 = document.getElementById("p33_1").value.toLowerCase().trim();
  const r2 = document.getElementById("p33_2").value.toLowerCase().trim();
  const r3 = document.getElementById("p33_3").value.toLowerCase().trim();

  const msg33 = document.getElementById("msg33");

  // RESPUESTAS CORRECTAS
  const correctas = {
    r1: ["pero", "sin embargo"],
    r2: ["sin embargo", "no obstante"],
    r3: ["ademas", "tambien"]
  };

  const ok1 = correctas.r1.includes(r1);
  const ok2 = correctas.r2.includes(r2);
  const ok3 = correctas.r3.includes(r3);

  if (ok1 && ok2 && ok3) {
    sumarRecompensa(5, 3);
    msg33.textContent = "Muy bien!";

    setTimeout(() => {
      cambiarPantalla(screen33, screen34); // siguiente pantalla
    }, 1500);

  } else {
    playError(); // SONIDO DE ERROR 
    msg33.textContent = "Sigue intentando";
  }
}

// =================================
// PANTALLA 34 - IDENTIFICAR ERROR
// =================================

const screen34 = document.getElementById("screen34");
const screen35 = document.getElementById("screen35"); // siguiente pantalla
const msg34 = document.getElementById("msg34");

function verificar34(opcion) {

  const correcta = "logica";
  const botones = document.querySelectorAll("#screen34 .btn-opcion");

  botones.forEach(btn => btn.classList.remove("correcta", "incorrecta"));

  if (opcion === correcta) {
    
	sumarRecompensa(5, 3);
    msg34.textContent = "Muy bien!";

    botones.forEach(btn => {
      if (btn.innerText.includes("No hay secuencia logica")) {
        btn.classList.add("correcta");
      }
    });

    setTimeout(() => {
      cambiarPantalla(screen34, screen35);
    }, 1500);

  } else {
    playError(); // SONIDO DE ERROR 
    msg34.textContent = "Sigue intentando";

    botones.forEach(btn => {
      if (btn.innerText.toLowerCase().includes(opcion)) {
        btn.classList.add("incorrecta");
      }
    });

  }
}

// =================================
// PANTALLA 35 - IDENTIFICAR ERROR
// =================================

//const screen35 = document.getElementById("screen35");
//const screen36 = document.getElementById("screen36"); // siguiente pantalla
const msg35 = document.getElementById("msg35");

function verificar35(opcion) {

  const correcta = "logica";
  const botones = document.querySelectorAll("#screen35 .btn35");

  botones.forEach(btn => btn.classList.remove("correcta", "incorrecta"));

  if (opcion === correcta) {
    sumarRecompensa(5, 3);
    msg35.textContent = "Muy bien!";

    botones.forEach(btn => {
      if (btn.innerText.includes("No hay secuencia logica")) {
        btn.classList.add("correcta");
      }
    });

    // bloquear botones
    botones.forEach(btn => btn.disabled = true);

    setTimeout(() => {
      cambiarPantalla(screen35, screen36);
    }, 1500);

  } else {
    playError(); //SONIDO DE ERROR 
    msg35.textContent = "Sigue intentando";

    botones.forEach(btn => {
      if (btn.innerText.toLowerCase().includes(opcion)) {
        btn.classList.add("incorrecta");
      }
    });

  }
}


// PANTALLA 36 - MINI HISTORIA
const screen36 = document.getElementById("screen36");
//const screen37 = document.getElementById("screen37"); // pantalla final opcional
const msg36 = document.getElementById("msg36");

function verificar36() {

  const texto = document.getElementById("texto36").value
  .toLowerCase()
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .trim();

  // separar por l铆neas
  const lineas = texto.split("\n").filter(l => l.trim() !== "");

  // lista de conectores v谩lidos
  const conectores = [
    "y", "luego", "despues", "ademas", "aunque",
    "por eso", "finalmente", "en cambio", "tambien"
  ];

  let conectoresUsados = 0;

  conectores.forEach(con => {
    if (texto.toLowerCase().includes(con)) {
      conectoresUsados++;
    }
  });

  // VALIDACIONES
  if (lineas.length < 5) {
    playError(); //SONIDO DE ERROR 
    msg36.textContent = "Debes escribir al menos 5 lineas";
    return;
  }

  if (conectoresUsados < 2) {
    playError(); // SONIDO DE ERROR 
    msg36.textContent = "Usa al menos 2 conectores";
    return;
  }
  sumarRecompensa(5, 3);
  // CORRECTO
  msg36.textContent = "Muy bien!  Felicitaciones, has finalizado el juego";

  setTimeout(() => {
    if (screen37) {
      cambiarPantalla(screen36, screen37);
	  iniciarPantalla37();
    }
  }, 2000);
}

// =================================
// PANTALLA 37 - FINAL DEL JUEGO
// =================================

const screen37 = document.getElementById("screen37");

// Puedes cambiar estos valores dinmicamente si quieres
//let puntajeFinal = 100;
//let monedasFinal = 50;

function iniciarPantalla37() {

  const score = document.getElementById("score37");
  const coins = document.getElementById("coins37");
  const barra = document.getElementById("barra37");
  
  if (score) score.textContent = puntaje;
  if (coins) coins.textContent = monedas + " 🪙";
  //document.getElementById("score37").textContent = puntajeFinal;
  //document.getElementById("coins37").textContent = monedasFinal + " 馃獧";

  // animar barra al 100%
  setTimeout(() => {
    if (barra) barra.style.width = progreso + "%";
	//document.getElementById("barra37").style.width = "100%";
  }, 300);
}

// FUNCI脫N SALIR
function salirJuego() {
  alert("Gracias por jugar! ");
    // resetear datos
  localStorage.removeItem("puntaje");
  localStorage.removeItem("monedas");
  localStorage.removeItem("progreso");
  // opci贸n 1: recargar juego
  location.reload();

  // opci贸n 2 (si quieres cerrar flujo):
  // window.close();
}

function toggleVideo() {
  const box = document.getElementById("videoBox");

  if (box.style.height === "30px") {
    box.style.height = "auto";
  } else {
    box.style.height = "30px";
  }
}

 const videosPorPantalla = {
  menu: "assets/Pantalla-1-intro.mp4",
  selectScreen: "assets/Pantalla-nivel-1.mp4",
  islandScreen: "assets/Pantalla-2.mp4",
  levelScreen: "assets/Pantalla-3.mp4",
  matchScreen: "assets/Pantalla-4.mp4",
  matchScreen2: "assets/Pantalla-5.mp4",
  screen7: "assets/Pantalla-6.mp4",
  screen8: "assets/Pantalla-7.mp4",
  screen9: "assets/Pantalla-8.mp4",
  screen10: "assets/Pantalla-9.mp4",
  screen11: "assets/Pantalla-10.mp4",
  screen12: "assets/Pantalla-11.mp4",
  screen13: "assets/Pantalla-12.mp4",
  screen14: "assets/Pantalla-13.mp4",
  screen15: "assets/Pantalla-14.mp4",
  screen16: "assets/Pantalla-15.mp4",
  screen17: "assets/Pantalla-16.mp4",
  screen18: "assets/Pantalla-17.mp4",
  screen19: "assets/Pantalla-18.mp4",
  screen20: "assets/Pantalla-19.mp4",
  screen21: "assets/Pantalla-20.mp4",
  screen22: "assets/Pantalla-21.mp4",
  screen23: "assets/Pantalla-22.mp4",
  screen24: "assets/Pantalla-23.mp4",
  screen25: "assets/Pantalla-24.mp4",
  screen26: "assets/Pantalla-25.mp4",
  screen27: "assets/Pantalla-26.mp4",
  screen28: "assets/Pantalla-27.mp4",
  screen29: "assets/Pantalla-28.mp4",
  screen30: "assets/Pantalla-29.mp4",
  screen31: "assets/Pantalla-30.mp4",
  screen32: "assets/Pantalla-31.mp4",
  screen33: "assets/Pantalla-32.mp4",
  screen34: "assets/Pantalla-33.mp4",
  screen35: "assets/Pantalla-34.mp4",
  screen36: "assets/Pantalla-36.mp4",
  screen37: "assets/Pantalla-37.mp4",
};

 function cambiarVideo(pantallaId) {
  const video = document.getElementById("videoGame");
  const source = document.getElementById("videoSource");

  const nuevaRuta = videosPorPantalla[pantallaId];

  if (!nuevaRuta) {
    video.pause();
    return;
  }

  source.src = nuevaRuta;
  video.load();
  video.play().catch(() => {}); // evita error autoplay
}
 // 馃攰 FUNCIONES DE AUDIO
	function playClick() {
	  const s = document.getElementById("soundClick");
	  if (s) { s.currentTime = 0; s.play(); }
	}

	function playCorrect() {
	  const s = document.getElementById("soundCorrect");
	  if (s) { s.currentTime = 0; s.play(); }
	}

	function playError() {
	  const s = document.getElementById("soundError");
	  if (s) { s.currentTime = 0; s.play(); }
	}

	// 馃幍 M脷SICA DE FONDO
	function iniciarMusica() {
	  const music = document.getElementById("musicBg");
	  if (music) music.play().catch(()=>{});
	}