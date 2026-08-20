/* =========================================================
   GRITO EVENTOS
   Main JavaScript
========================================================= */


/* =========================================================
   BUSINESS CONFIGURATION
========================================================= */

const BUSINESS = {
    name: "GRITO Eventos",
    whatsapp: "526731340913",
    city: "Guamúchil",
    state: "Sinaloa",
    country: "México"
};


/* =========================================================
   DOM READY
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    initEventChoices();

    initPeopleChoices();

    initCustomPeople();

    initServiceChoices();

    initDate();

    initWhatsAppQuote();

    initInfoCards();

    initSmoothScroll();

});



/* =========================================================
   01 · EVENT TYPE
========================================================= */

function initEventChoices() {

    const eventButtons = document.querySelectorAll(
        ".event-types .choice"
    );

    if (!eventButtons.length) {
        return;
    }


    eventButtons.forEach(button => {

        button.addEventListener("click", () => {

            eventButtons.forEach(item => {
                item.classList.remove("selected");
            });

            button.classList.add("selected");

        });

    });

}



/* =========================================================
   02 · PEOPLE
========================================================= */

function initPeopleChoices() {

    const peopleButtons = document.querySelectorAll(
        ".people .choice"
    );

    if (!peopleButtons.length) {
        return;
    }


    peopleButtons.forEach(button => {

        button.addEventListener("click", () => {

            peopleButtons.forEach(item => {
                item.classList.remove("selected");
            });


            button.classList.add("selected");


            const customInput = document.getElementById(
                "customPeople"
            );


            if (customInput) {
                customInput.value = "";
            }

        });

    });

}



/* =========================================================
   CUSTOM PEOPLE NUMBER
========================================================= */

function initCustomPeople() {

    const customInput = document.getElementById(
        "customPeople"
    );


    if (!customInput) {
        return;
    }


    customInput.addEventListener("input", () => {

        const peopleButtons = document.querySelectorAll(
            ".people .choice"
        );


        peopleButtons.forEach(button => {
            button.classList.remove("selected");
        });

    });

}



/* =========================================================
   03 · SERVICES
========================================================= */

function initServiceChoices() {

    const serviceChoices = document.querySelectorAll(
        ".service-choice"
    );


    serviceChoices.forEach(choice => {

        const checkbox = choice.querySelector(
            'input[type="checkbox"]'
        );


        if (!checkbox) {
            return;
        }


        checkbox.addEventListener("change", () => {

            if (checkbox.checked) {

                choice.classList.add("selected");

            } else {

                choice.classList.remove("selected");

            }

        });

    });

}



/* =========================================================
   04 · DATE
========================================================= */

function initDate() {

    const dateInput = document.getElementById(
        "eventDate"
    );


    if (!dateInput) {
        return;
    }


    /*
        Prevent selecting dates in the past.
    */

    const today = new Date();


    const year = today.getFullYear();

    const month = String(
        today.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        today.getDate()
    ).padStart(2, "0");


    dateInput.min = `${year}-${month}-${day}`;

}



/* =========================================================
   WHATSAPP QUOTE
========================================================= */

function initWhatsAppQuote() {

    const whatsappButton = document.getElementById(
        "whatsappQuote"
    );


    if (!whatsappButton) {
        return;
    }


    whatsappButton.addEventListener("click", () => {

        const eventType = getSelectedEvent();

        const people = getSelectedPeople();

        const services = getSelectedServices();

        const date = getEventDate();


        /*
            Validation
        */

        if (!eventType) {

            showQuoteError(
                "Selecciona el tipo de evento."
            );

            return;

        }


        if (!people) {

            showQuoteError(
                "Selecciona el número de personas."
            );

            return;

        }


        if (!services.length) {

            showQuoteError(
                "Selecciona al menos una opción de lo que necesitas."
            );

            return;

        }


        if (!date) {

            showQuoteError(
                "Selecciona la fecha de tu evento."
            );

            return;

        }


        /*
            Everything is valid.
            Create WhatsApp message.
        */

        const message = createWhatsAppMessage({
            eventType,
            people,
            services,
            date
        });


        const whatsappURL =
            `https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(message)}`;


        /*
            Open WhatsApp
        */

        window.open(
            whatsappURL,
            "_blank",
            "noopener,noreferrer"
        );

    });

}



/* =========================================================
   GET EVENT
========================================================= */

function getSelectedEvent() {

    const selected = document.querySelector(
        ".event-types .choice.selected"
    );


    if (!selected) {
        return "";
    }


    return selected.dataset.event || "";

}



/* =========================================================
   GET PEOPLE
========================================================= */

function getSelectedPeople() {

    const selected = document.querySelector(
        ".people .choice.selected"
    );


    if (selected) {

        return selected.dataset.people || "";

    }


    const customInput = document.getElementById(
        "customPeople"
    );


    if (
        customInput &&
        customInput.value.trim() !== ""
    ) {

        return customInput.value.trim();

    }


    return "";

}



/* =========================================================
   GET SERVICES
========================================================= */

function getSelectedServices() {

    const checked = document.querySelectorAll(
        '.service-choice input[type="checkbox"]:checked'
    );


    return Array.from(checked).map(
        checkbox => checkbox.value
    );

}



/* =========================================================
   GET DATE
========================================================= */

function getEventDate() {

    const dateInput = document.getElementById(
        "eventDate"
    );


    if (!dateInput) {
        return "";
    }


    if (!dateInput.value) {
        return "";
    }


    return formatDateForMexico(
        dateInput.value
    );

}



/* =========================================================
   FORMAT DATE
========================================================= */

function formatDateForMexico(dateString) {

    const parts = dateString.split("-");


    if (parts.length !== 3) {
        return dateString;
    }


    const year = parts[0];

    const month = parts[1];

    const day = parts[2];


    return `${day}/${month}/${year}`;

}



/* =========================================================
   CREATE WHATSAPP MESSAGE
========================================================= */

function createWhatsAppMessage({
    eventType,
    people,
    services,
    date
}) {


    let message = "";


    message += `Hola ${BUSINESS.name} 👋\n\n`;


    message +=
        `Me gustaría solicitar una cotización para mi evento.\n\n`;


    message +=
        `Tipo de evento:\n${eventType}\n\n`;


    message +=
        `Número de personas:\n${people}\n\n`;


    message +=
        `Fecha:\n${date}\n\n`;


    message +=
        `Estoy interesado en:\n`;


    services.forEach(service => {

        message += `- ${service}\n`;

    });


    message += `\n`;


    message +=
        `¿Me pueden compartir disponibilidad y cotización?\n\n`;


    message +=
        `¡Gracias!`;


    return message;

}



/* =========================================================
   ERROR MESSAGE
========================================================= */

function showQuoteError(message) {

    /*
        Remove existing error.
    */

    const existingError = document.querySelector(
        ".quote-error"
    );


    if (existingError) {
        existingError.remove();
    }


    /*
        Create error message.
    */

    const error = document.createElement("div");


    error.className = "quote-error";


    error.textContent = message;


    /*
        Insert above WhatsApp button.
    */

    const button = document.getElementById(
        "whatsappQuote"
    );


    if (button) {

        button.parentNode.insertBefore(
            error,
            button
        );

    }


    /*
        Automatically remove after 4 seconds.
    */

    setTimeout(() => {

        if (error) {
            error.remove();
        }

    }, 4000);

}



/* =========================================================
   INFORMATION CARDS
========================================================= */

function initInfoCards() {

    const cards = document.querySelectorAll(
        ".info-card"
    );


    if (!cards.length) {
        return;
    }


    cards.forEach(card => {

        card.addEventListener("click", event => {

            /*
                Don't trigger when clicking
                a link inside the expanded content.
            */

            if (
                event.target.closest("a")
            ) {
                return;
            }


            toggleInfoCard(card);

        });


        /*
            Keyboard accessibility
        */

        card.addEventListener("keydown", event => {

            if (
                event.key === "Enter" ||
                event.key === " "
            ) {

                event.preventDefault();

                toggleInfoCard(card);

            }

        });

    });

}



/* =========================================================
   TOGGLE INFORMATION CARD
========================================================= */

function toggleInfoCard(card) {

    const details = card.querySelector(
        ".info-details"
    );


    const toggle = card.querySelector(
        ".info-toggle"
    );


    if (!details) {
        return;
    }


    const isOpen =
        card.classList.contains("open");


    /*
        Close all other cards.
        This keeps the page clean.
    */

    document
        .querySelectorAll(".info-card.open")
        .forEach(openCard => {

            if (openCard !== card) {

                openCard.classList.remove(
                    "open"
                );


                const otherToggle =
                    openCard.querySelector(
                        ".info-toggle"
                    );


                if (otherToggle) {
                    otherToggle.textContent = "+";
                }

            }

        });


    /*
        Toggle current card.
    */

    if (isOpen) {

        card.classList.remove("open");


        if (toggle) {
            toggle.textContent = "+";
        }


    } else {

        card.classList.add("open");


        if (toggle) {
            toggle.textContent = "−";
        }

    }

}



/* =========================================================
   SMOOTH SCROLL
========================================================= */

function initSmoothScroll() {

    const links = document.querySelectorAll(
        'a[href^="#"]'
    );


    links.forEach(link => {

        link.addEventListener("click", event => {

            const targetID =
                link.getAttribute("href");


            if (
                !targetID ||
                targetID === "#"
            ) {
                return;
            }


            const target =
                document.querySelector(
                    targetID
                );


            if (!target) {
                return;
            }


            event.preventDefault();


            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        });

    });

}



/* =========================================================
   END
========================================================= */
