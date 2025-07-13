import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";


const form = document.querySelector(".form"); 

let selectedState;

form.addEventListener('submit', (event) => { 
    event.preventDefault(); 

    let del = document.querySelector("input[type='number']").value;
    del = Number(del);
    const promise = new Promise((resolve, reject) => {
        setTimeout(() => {
            const checkedRadio = document.querySelector("input[name='state']:checked");
            if (checkedRadio) {
                selectedState = checkedRadio.value;
                if (selectedState === "fulfilled") {
                    resolve(del); // Передаём значение
                } else if (selectedState === "rejected") {
                    reject(del); // Передаём значение
                }
            }
        }, del); 
    });

    promise
        .then((result) => {
            iziToast.success({
                icon: null,
                progressBar: false,
                transitionIn: 'fadeIn', 
                position: 'topRight', 
                title: '✅',
                message: `Fulfilled promise in ${result}ms`,
                animateInside: false,
            });
        })
        .catch((error) => {
            iziToast.error({
                icon: null,
                progressBar: false,
                transitionIn: 'fadeIn', 
                position: 'topRight', 
                title: '❌',
                message: `Rejected promise in ${error}ms`,
                animateInside: false,
            });
        });
});