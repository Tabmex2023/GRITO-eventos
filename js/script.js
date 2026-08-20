/* =====================================================
   GRITO EVENTOS
   script.js
   ===================================================== */


/* =====================================================
   BUSINESS CONFIGURATION
   ===================================================== */

const CONFIG = {
    BUSINESS_NAME: "GRITO Eventos",
    WHATSAPP_NUMBER: "526731340913",
    CITY: "Guamúchil",
    STATE: "Sinaloa",
    COUNTRY: "México",

    INSTAGRAM_URL: "",
    TIKTOK_URL: "",
    FACEBOOK_URL: ""
};


/* =====================================================
   CURRENT EVENT DATA
   ===================================================== */

const eventData = {
    type: "",
    people: "",
    customPeople: "",
    services: [],
    date: "",
    location: "",
    colonia: "",
    name: "",
    whatsapp: "",
    message: ""
};


/* =====================================================
   DOM READY
   ===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    initEventChoices();
    initPeopleChoices();
    initServiceChoices();
    initFormFields();
    initQuoteButton();

    initInfoCards();
    initModal();

    initSmoothScroll();

    initSocialLinks();

});


/* =====================================================
   EVENT TYPE
   ===================================================== */

function initEventChoices() {

    const buttons = document.querySelectorAll("[data-event]");

    buttons.forEach(button => {

        button.addEventListener("click", () => {

            buttons.forEach(item => {
                item.classList.remove("selected");
            });

            button.classList.add("selected");

            eventData.type =
                button.dataset.event || "";

        });

    });

}


/* =====================================================
   NUMBER OF PEOPLE
   ===================================================== */

function initPeopleChoices() {

    const buttons =
        document.querySelectorAll("[data-people]");

    const customInput =
        document.querySelector("#customPeople");

    buttons.forEach(button => {

        button.addEventListener("click", () => {

            buttons.forEach(item => {
                item.classList.remove("selected");
            });

            button.classList.add("selected");

            eventData.people =
                button.dataset.people || "";

            if (customInput) {
                customInput.value = "";
            }

        });

    });


    if (customInput) {

        customInput.addEventListener("input", () => {

            if (customInput.value.trim() !== "") {

                buttons.forEach(item => {
                    item.classList.remove("selected");
                });

                eventData.people = "Personalizado";

                eventData.customPeople =
                    customInput.value.trim();

            } else {

                eventData.customPeople = "";

            }

        });

    }

}


/* =====================================================
   SERVICES
   ===================================================== */

function initServiceChoices() {

    const checkboxes =
        document.querySelectorAll(
            ".service-choice input"
        );


    checkboxes.forEach(checkbox => {

        checkbox.addEventListener("change", () => {

            const service =
                checkbox.dataset.service ||
                checkbox.value;

            if (checkbox.checked) {

                if (!eventData.services.includes(service)) {

                    eventData.services.push(service);

                }

            } else {

                eventData.services =
                    eventData.services.filter(
                        item => item !== service
                    );

            }

        });

    });

}


/* =====================================================
   FORM FIELDS
   ===================================================== */

function initFormFields() {

    const fields = {

        eventDate: "date",

        eventLocation: "location",

        eventColonia: "colonia",

        clientName: "name",

        clientWhatsapp: "whatsapp",

        additionalMessage: "message"

    };


    Object.entries(fields).forEach(
        ([elementId, dataKey]) => {

            const element =
                document.getElementById(elementId);

            if (!element) return;


            element.addEventListener(
                "input",
                () => {

                    eventData[dataKey] =
                        element.value.trim();

                }
            );

        }
    );

}


/* =====================================================
   QUOTE BUTTON
   ===================================================== */

function initQuoteButton() {

    const button =
        document.getElementById(
            "whatsappQuote"
        );

    if (!button) return;


    button.addEventListener("click", () => {

        if (!validateQuote()) {
            return;
        }


        const message =
            createWhatsAppMessage();


        const encodedMessage =
            encodeURIComponent(message);


        const whatsappURL =
            `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodedMessage}`;


        window.open(
            whatsappURL,
            "_blank",
            "noopener,noreferrer"
        );

    });

}


/* =====================================================
   VALIDATION
   ===================================================== */

function validateQuote() {

    const errors = [];


    if (!eventData.type) {
        errors.push(
            "Selecciona el tipo de evento."
        );
    }


    const numberOfPeople =
        getPeopleValue();

    if (!numberOfPeople) {
        errors.push(
            "Indica cuántas personas asistirán."
        );
    }


    if (!eventData.date) {
        errors.push(
            "Selecciona la fecha del evento."
        );
    }


    if (!eventData.location) {
        errors.push(
            "Indica dónde será tu evento."
        );
    }


    if (!eventData.name) {
        errors.push(
            "Escribe tu nombre."
        );
    }


    if (!eventData.whatsapp) {
        errors.push(
            "Escribe tu número de WhatsApp."
        );
    }


    if (errors.length > 0) {

        alert(
            "Antes de continuar:\n\n" +
            errors.map(
                error => "• " + error
            ).join("\n")
        );

        return false;

    }


    return true;

}


/* =====================================================
   PEOPLE VALUE
   ===================================================== */

function getPeopleValue() {

    if (
        eventData.people ===
        "Personalizado"
    ) {

        return eventData.customPeople;

    }


    return eventData.people;

}


/* =====================================================
   WHATSAPP MESSAGE
   ===================================================== */

function createWhatsAppMessage() {

    const people =
        getPeopleValue();


    const services =
        eventData.services.length > 0

            ? eventData.services
                .map(service => `- ${service}`)
                .join("\n")

            : "- Me gustaría recibir recomendación sobre lo que necesito";


    let location =
        eventData.location;


    if (eventData.colonia) {

        location +=
            `, ${eventData.colonia}`;

    }


    let message =

`Hola ${CONFIG.BUSINESS_NAME} 👋

Me gustaría solicitar una cotización para mi evento.

Tipo de evento:
${eventData.type}

Número de personas:
${people}

Fecha:
${formatDate(eventData.date)}

Ubicación:
${location}

Estoy interesado en:
${services}`;


    if (eventData.message) {

        message +=

`

Mensaje adicional:
${eventData.message}`;

    }


    if (eventData.name) {

        message +=

`

Mi nombre:
${eventData.name}`;

    }


    if (eventData.whatsapp) {

        message +=

`

Mi WhatsApp:
${eventData.whatsapp}`;

    }


    message +=

`

¡Gracias!`;


    return message;

}


/* =====================================================
   DATE FORMAT
   ===================================================== */

function formatDate(dateString) {

    if (!dateString) {
        return "";
    }


    const date =
        new Date(
            `${dateString}T12:00:00`
        );


    if (Number.isNaN(date.getTime())) {
        return dateString;
    }


    return new Intl.DateTimeFormat(
        "es-MX",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        }
    ).format(date);

}


/* =====================================================
   INFO CARDS
   ===================================================== */

function initInfoCards() {

    const cards =
        document.querySelectorAll(
            "[data-info]"
        );


    cards.forEach(card => {

        card.addEventListener("click", () => {

            const info =
                card.dataset.info;

            openInfoModal(info);

        });

    });

}


/* =====================================================
   MODAL
   ===================================================== */

function initModal() {

    const modal =
        document.getElementById(
            "infoModal"
        );


    if (!modal) return;


    const closeButton =
        modal.querySelector(
            ".modal-close"
        );


    const overlay =
        modal.querySelector(
            ".modal-overlay"
        );


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeInfoModal
        );

    }


    if (overlay) {

        overlay.addEventListener(
            "click",
            closeInfoModal
        );

    }


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape"
            ) {

                closeInfoModal();

            }

        }
    );

}


/* =====================================================
   INFO MODAL CONTENT
   ===================================================== */

const infoContent = {

    mobiliario: {

        number: "01",

        title: "Mobiliario",

        text:
            "Todo lo necesario para que tus invitados estén cómodos y tu evento luzca bien organizado.",

        items: [
            "Sillas para eventos",
            "Mesas",
            "Mesas tipo cóctel",
            "Mesas para buffet",
            "Mantelería",
            "Decoración para sillas"
        ]

    },


    decoracion: {

        number: "02",

        title: "Decoración",

        text:
            "Diseñamos y elaboramos parte de nuestra decoración pensando en el estilo y ocasión de cada evento.",

        items: [
            "Centros de mesa",
            "Arcos decorativos",
            "Fondos para fotos",
            "Decoración floral",
            "Velas LED e iluminación",
            "Decoración personalizada"
        ]

    },


    climatizacion: {

        number: "03",

        title: "Climatización",

        text:
            "Para eventos donde el clima es un factor importante, contamos con opciones de climatización portátil.",

        items: [
            "Aire acondicionado portátil",
            "Opciones según el espacio",
            "Disponibilidad por evento",
            "Confirmación previa de capacidad"
        ]

    },


    logistica: {

        number: "04",

        title: "Entrega y montaje",

        text:
            "Nos encargamos de la parte logística para que tú puedas concentrarte en disfrutar tu celebración.",

        items: [
            "Entrega",
            "Montaje",
            "Desmontaje",
            "Recolección",
            "Coordinación según ubicación"
        ]

    }

};


/* =====================================================
   OPEN MODAL
   ===================================================== */

function openInfoModal(type) {

    const data =
        infoContent[type];

    if (!data) return;


    const modal =
        document.getElementById(
            "infoModal"
        );


    if (!modal) return;


    const number =
        modal.querySelector(
            ".modal-number"
        );


    const title =
        modal.querySelector(
            ".modal-title"
        );


    const text =
        modal.querySelector(
            ".modal-text"
        );


    const list =
        modal.querySelector(
            ".modal-list"
        );


    if (number) {
        number.textContent =
            data.number;
    }


    if (title) {
        title.textContent =
            data.title;
    }


    if (text) {
        text.textContent =
            data.text;
    }


    if (list) {

        list.innerHTML =
            data.items
                .map(
                    item =>
                        `<li>${item}</li>`
                )
                .join("");

    }


    modal.classList.add("active");

    document.body.style.overflow =
        "hidden";

}


/* =====================================================
   CLOSE MODAL
   ===================================================== */

function closeInfoModal() {

    const modal =
        document.getElementById(
            "infoModal"
        );


    if (!modal) return;


    modal.classList.remove(
        "active"
    );


    document.body.style.overflow =
        "";

}


/* =====================================================
   SMOOTH SCROLL
   ===================================================== */

function initSmoothScroll() {

    document.querySelectorAll(
        'a[href^="#"]'
    ).forEach(link => {

        link.addEventListener(
            "click",
            event => {

                const targetId =
                    link.getAttribute(
                        "href"
                    );


                if (
                    !targetId ||
                    targetId === "#"
                ) {
                    return;
                }


                const target =
                    document.querySelector(
                        targetId
                    );


                if (!target) return;


                event.preventDefault();


                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }
        );

    });

}


/* =====================================================
   SOCIAL MEDIA
   ===================================================== */

function initSocialLinks() {

    const socialLinks = {

        instagram:
            CONFIG.INSTAGRAM_URL,

        tiktok:
            CONFIG.TIKTOK_URL,

        facebook:
            CONFIG.FACEBOOK_URL

    };


    Object.entries(
        socialLinks
    ).forEach(
        ([platform, url]) => {

            const links =
                document.querySelectorAll(
                    `[data-social="${platform}"]`
                );


            links.forEach(link => {

                if (url) {

                    link.href = url;

                    link.target = "_blank";

                    link.rel =
                        "noopener noreferrer";

                } else {

                    link.style.display =
                        "none";

                }

            });

        }
    );

}


/* =====================================================
   GLOBAL CONFIG
   ===================================================== */

window.GRITO = {

    CONFIG,

    eventData,

    createWhatsAppMessage

};
