/* =========================================================
   GRITO EVENTOS
   Main JavaScript
   ========================================================= */


/* =========================================================
   1. BUSINESS CONFIGURATION
   ========================================================= */

const BUSINESS_CONFIG = {
    name: "GRITO Eventos",
    whatsapp: "526731340913",
    city: "Guamúchil",
    state: "Sinaloa",
    country: "México",

    social: {
        instagram: "INSTAGRAM_URL",
        tiktok: "TIKTOK_URL",
        facebook: "FACEBOOK_URL"
    }
};


/* =========================================================
   2. DOM READY
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    initMobileNavigation();
    initConfigurator();
    initFAQ();
    initSmoothScroll();
    initWhatsAppLinks();
    initCurrentYear();

});


/* =========================================================
   3. MOBILE NAVIGATION
   ========================================================= */

function initMobileNavigation() {

    const toggle = document.querySelector(".mobile-menu-toggle");
    const navigation = document.querySelector(".main-navigation");

    if (!toggle || !navigation) {
        return;
    }

    toggle.addEventListener("click", () => {

        navigation.classList.toggle("open");

        const isOpen = navigation.classList.contains("open");

        toggle.setAttribute("aria-expanded", isOpen);

    });


    /* Close menu after clicking a navigation link */

    const navLinks = navigation.querySelectorAll("a");

    navLinks.forEach(link => {

        link.addEventListener("click", () => {

            navigation.classList.remove("open");

            toggle.setAttribute("aria-expanded", "false");

        });

    });

}


/* =========================================================
   4. CONFIGURATOR
   ========================================================= */

function initConfigurator() {

    const configurator = document.querySelector("#event-configurator");

    if (!configurator) {
        return;
    }


    /* -----------------------------------------------------
       Elements
       ----------------------------------------------------- */

    const steps = configurator.querySelectorAll(".config-step");

    const progressSteps =
        configurator.querySelectorAll(".progress-step");

    const nextButtons =
        configurator.querySelectorAll("[data-next]");

    const previousButtons =
        configurator.querySelectorAll("[data-prev]");


    let currentStep = 0;


    /* -----------------------------------------------------
       Customer data
       ----------------------------------------------------- */

    const eventData = {

        eventType: "",

        guests: "",

        customGuests: "",

        needs: [],

        date: "",

        location: "",

        neighborhood: "",

        name: "",

        whatsapp: "",

        message: ""

    };


    /* -----------------------------------------------------
       Show step
       ----------------------------------------------------- */

    function showStep(index) {

        if (index < 0 || index >= steps.length) {
            return;
        }

        currentStep = index;


        steps.forEach((step, stepIndex) => {

            step.classList.toggle(
                "active",
                stepIndex === currentStep
            );

        });


        progressSteps.forEach(
            (progressStep, progressIndex) => {

                progressStep.classList.toggle(
                    "active",
                    progressIndex === currentStep
                );

                progressStep.classList.toggle(
                    "completed",
                    progressIndex < currentStep
                );

            }
        );


        /* Scroll configurator to top on mobile */

        const rect =
            configurator.getBoundingClientRect();

        if (
            rect.top < 0 ||
            rect.top > window.innerHeight
        ) {

            configurator.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }

    }


    /* -----------------------------------------------------
       Next buttons
       ----------------------------------------------------- */

    nextButtons.forEach(button => {

        button.addEventListener("click", () => {

            const targetStep =
                parseInt(
                    button.dataset.next,
                    10
                );

            if (!validateStep(currentStep)) {
                return;
            }

            collectCurrentStepData();

            showStep(targetStep);

        });

    });


    /* -----------------------------------------------------
       Previous buttons
       ----------------------------------------------------- */

    previousButtons.forEach(button => {

        button.addEventListener("click", () => {

            const targetStep =
                parseInt(
                    button.dataset.prev,
                    10
                );

            showStep(targetStep);

        });

    });


    /* -----------------------------------------------------
       Event type
       ----------------------------------------------------- */

    const eventOptions =
        configurator.querySelectorAll(
            "[data-event-type]"
        );

    eventOptions.forEach(option => {

        option.addEventListener("click", () => {

            eventOptions.forEach(item => {
                item.classList.remove("selected");
            });

            option.classList.add("selected");

            eventData.eventType =
                option.dataset.eventType;

        });

    });


    /* -----------------------------------------------------
       Guest count
       ----------------------------------------------------- */

    const guestOptions =
        configurator.querySelectorAll(
            "[data-guests]"
        );

    guestOptions.forEach(option => {

        option.addEventListener("click", () => {

            guestOptions.forEach(item => {
                item.classList.remove("selected");
            });

            option.classList.add("selected");

            eventData.guests =
                option.dataset.guests;

            const customInput =
                document.querySelector(
                    "#custom-guests"
                );

            if (customInput) {

                customInput.value = "";

                eventData.customGuests = "";

            }

        });

    });


    /* -----------------------------------------------------
       Custom guest number
       ----------------------------------------------------- */

    const customGuests =
        document.querySelector("#custom-guests");

    if (customGuests) {

        customGuests.addEventListener(
            "input",
            () => {

                const value =
                    customGuests.value.trim();

                if (value !== "") {

                    guestOptions.forEach(option => {
                        option.classList.remove(
                            "selected"
                        );
                    });

                    eventData.guests = "Personalizado";

                    eventData.customGuests = value;

                }

            }
        );

    }


    /* -----------------------------------------------------
       Needs / products
       ----------------------------------------------------- */

    const needCheckboxes =
        configurator.querySelectorAll(
            'input[name="event-needs"]'
        );

    needCheckboxes.forEach(checkbox => {

        checkbox.addEventListener("change", () => {

            eventData.needs =
                Array.from(needCheckboxes)

                    .filter(item => item.checked)

                    .map(item => item.value);

        });

    });


    /* -----------------------------------------------------
       Final WhatsApp button
       ----------------------------------------------------- */

    const whatsappButton =
        configurator.querySelector(
            "#configurator-whatsapp"
        );

    if (whatsappButton) {

        whatsappButton.addEventListener(
            "click",
            () => {

                collectCurrentStepData();

                if (!validateStep(currentStep)) {
                    return;
                }

                const message =
                    createWhatsAppMessage(
                        eventData
                    );

                openWhatsApp(message);

            }
        );

    }


    /* -----------------------------------------------------
       Form fields
       ----------------------------------------------------- */

    const formFields = {

        date:
            document.querySelector("#event-date"),

        location:
            document.querySelector("#event-location"),

        neighborhood:
            document.querySelector(
                "#event-neighborhood"
            ),

        name:
            document.querySelector("#customer-name"),

        whatsapp:
            document.querySelector(
                "#customer-whatsapp"
            ),

        message:
            document.querySelector(
                "#customer-message"
            )

    };


    Object.entries(formFields).forEach(
        ([key, field]) => {

            if (!field) {
                return;
            }

            field.addEventListener(
                "input",
                () => {

                    eventData[key] =
                        field.value.trim();

                    field.classList.remove(
                        "field-error"
                    );

                }
            );

        }
    );


    /* -----------------------------------------------------
       Initial state
       ----------------------------------------------------- */

    showStep(0);


    /* -----------------------------------------------------
       Validation
       ----------------------------------------------------- */

    function validateStep(stepIndex) {

        clearValidationMessages();


        /* STEP 1 — EVENT TYPE */

        if (stepIndex === 0) {

            if (!eventData.eventType) {

                showValidation(
                    "Selecciona el tipo de evento."
                );

                return false;

            }

        }


        /* STEP 2 — GUESTS */

        if (stepIndex === 1) {

            if (
                !eventData.guests &&
                !eventData.customGuests
            ) {

                showValidation(
                    "Indica aproximadamente cuántas personas asistirán."
                );

                return false;

            }

            if (
                eventData.guests === "Personalizado" &&
                !eventData.customGuests
            ) {

                showValidation(
                    "Indica el número de personas."
                );

                return false;

            }

        }


        /* STEP 3 — NEEDS */

        if (stepIndex === 2) {

            if (eventData.needs.length === 0) {

                showValidation(
                    "Selecciona al menos un servicio o producto."
                );

                return false;

            }

        }


        /* STEP 4 — DATE / LOCATION */

        if (stepIndex === 3) {

            const date =
                document.querySelector(
                    "#event-date"
                );

            const location =
                document.querySelector(
                    "#event-location"
                );


            if (
                !date ||
                !date.value
            ) {

                markError(date);

                showValidation(
                    "Selecciona la fecha de tu evento."
                );

                return false;

            }


            if (
                !location ||
                !location.value.trim()
            ) {

                markError(location);

                showValidation(
                    "Indica dónde será tu evento."
                );

                return false;

            }

        }


        /* STEP 5 — CONTACT */

        if (stepIndex === 4) {

            const name =
                document.querySelector(
                    "#customer-name"
                );

            const whatsapp =
                document.querySelector(
                    "#customer-whatsapp"
                );


            if (
                !name ||
                !name.value.trim()
            ) {

                markError(name);

                showValidation(
                    "Indica tu nombre."
                );

                return false;

            }


            if (
                !whatsapp ||
                !whatsapp.value.trim()
            ) {

                markError(whatsapp);

                showValidation(
                    "Indica tu número de WhatsApp."
                );

                return false;

            }


            const cleanPhone =
                whatsapp.value.replace(
                    /[^0-9+]/g,
                    ""
                );


            if (cleanPhone.length < 8) {

                markError(whatsapp);

                showValidation(
                    "Verifica tu número de WhatsApp."
                );

                return false;

            }

        }


        return true;

    }


    /* -----------------------------------------------------
       Collect data
       ----------------------------------------------------- */

    function collectCurrentStepData() {

        const date =
            document.querySelector(
                "#event-date"
            );

        const location =
            document.querySelector(
                "#event-location"
            );

        const neighborhood =
            document.querySelector(
                "#event-neighborhood"
            );

        const name =
            document.querySelector(
                "#customer-name"
            );

        const whatsapp =
            document.querySelector(
                "#customer-whatsapp"
            );

        const message =
            document.querySelector(
                "#customer-message"
            );


        if (date) {
            eventData.date =
                date.value.trim();
        }

        if (location) {
            eventData.location =
                location.value.trim();
        }

        if (neighborhood) {
            eventData.neighborhood =
                neighborhood.value.trim();
        }

        if (name) {
            eventData.name =
                name.value.trim();
        }

        if (whatsapp) {
            eventData.whatsapp =
                whatsapp.value.trim();
        }

        if (message) {
            eventData.message =
                message.value.trim();
        }

    }


    /* -----------------------------------------------------
       Validation message
       ----------------------------------------------------- */

    function showValidation(message) {

        let validation =
            configurator.querySelector(
                ".validation-message"
            );


        if (!validation) {

            validation =
                document.createElement("div");

            validation.className =
                "validation-message";

            const activeStep =
                steps[currentStep];

            const actions =
                activeStep.querySelector(
                    ".step-actions"
                );

            if (actions) {

                activeStep.insertBefore(
                    validation,
                    actions
                );

            } else {

                activeStep.appendChild(
                    validation
                );

            }

        }


        validation.textContent = message;

        validation.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });

    }


    function clearValidationMessages() {

        configurator
            .querySelectorAll(
                ".validation-message"
            )
            .forEach(element => {

                element.remove();

            });

    }


    function markError(element) {

        if (!element) {
            return;
        }

        element.classList.add(
            "field-error"
        );

        element.focus();

    }

}


/* =========================================================
   5. WHATSAPP MESSAGE
   ========================================================= */

function createWhatsAppMessage(data) {

    const guests =
        data.customGuests
            ? data.customGuests
            : data.guests;


    const needsText =
        data.needs.length > 0

            ? data.needs
                .map(item => `- ${item}`)
                .join("\n")

            : "- Por definir";


    const neighborhoodText =
        data.neighborhood
            ? `\nColonia / comunidad: ${data.neighborhood}`
            : "";


    const additionalMessage =
        data.message
            ? data.message
            : "Sin mensaje adicional.";


    return `Hola GRITO Eventos 👋

Me gustaría solicitar una cotización para mi evento.

Tipo de evento:
${data.eventType}

Número de personas:
${guests}

Fecha:
${formatDate(data.date)}

Ubicación:
${data.location}${neighborhoodText}

Estoy interesado(a) en:
${needsText}

Nombre:
${data.name}

Mi WhatsApp:
${data.whatsapp}

Mensaje adicional:
${additionalMessage}

¡Gracias!`;
}


/* =========================================================
   6. FORMAT DATE
   ========================================================= */

function formatDate(dateString) {

    if (!dateString) {
        return "Por definir";
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


/* =========================================================
   7. OPEN WHATSAPP
   ========================================================= */

function openWhatsApp(message) {

    const encodedMessage =
        encodeURIComponent(message);


    const whatsappURL =
        `https://wa.me/${BUSINESS_CONFIG.whatsapp}?text=${encodedMessage}`;


    window.open(
        whatsappURL,
        "_blank",
        "noopener,noreferrer"
    );

}


/* =========================================================
   8. GENERAL WHATSAPP LINKS
   ========================================================= */

function initWhatsAppLinks() {

    const links =
        document.querySelectorAll(
            "[data-whatsapp]"
        );


    links.forEach(link => {

        link.addEventListener(
            "click",
            event => {

                event.preventDefault();

                const customMessage =
                    link.dataset.whatsappMessage ||
                    "Hola GRITO Eventos 👋 Me gustaría solicitar una cotización para mi evento.";

                openWhatsApp(
                    customMessage
                );

            }
        );

    });

}


/* =========================================================
   9. FAQ
   ========================================================= */

function initFAQ() {

    const faqItems =
        document.querySelectorAll(
            ".faq-item"
        );


    faqItems.forEach(item => {

        item.addEventListener(
            "toggle",
            () => {

                if (!item.open) {
                    return;
                }


                faqItems.forEach(otherItem => {

                    if (
                        otherItem !== item &&
                        otherItem.open
                    ) {

                        otherItem.open = false;

                    }

                });

            }
        );

    });

}


/* =========================================================
   10. SMOOTH SCROLL
   ========================================================= */

function initSmoothScroll() {

    const links =
        document.querySelectorAll(
            'a[href^="#"]'
        );


    links.forEach(link => {

        link.addEventListener(
            "click",
            event => {

                const targetId =
                    link.getAttribute("href");


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


                if (!target) {
                    return;
                }


                event.preventDefault();


                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }
        );

    });

}


/* =========================================================
   11. CURRENT YEAR
   ========================================================= */

function initCurrentYear() {

    const yearElements =
        document.querySelectorAll(
            "[data-current-year]"
        );


    yearElements.forEach(element => {

        element.textContent =
            new Date().getFullYear();

    });

}


/* =========================================================
   12. MINIMUM EVENT DATE
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const dateInput =
            document.querySelector(
                "#event-date"
            );


        if (!dateInput) {
            return;
        }


        const today =
            new Date();


        const year =
            today.getFullYear();


        const month =
            String(
                today.getMonth() + 1
            ).padStart(2, "0");


        const day =
            String(
                today.getDate()
            ).padStart(2, "0");


        dateInput.min =
            `${year}-${month}-${day}`;

    }
);
