"use strict";

const EXTRA_PRODUCTS = [
    {
        title: "Google Pixel 9",
        image: "https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=200",
        description: "Android puro con fotografia computacional para capturas de alta calidad."
    },
    {
        title: "Motorola Edge 50",
        image: "https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=200",
        description: "Rendimiento solido, carga rapida y un diseno moderno para uso diario."
    },
    {
        title: "OnePlus 12R",
        image: "https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=200",
        description: "Pantalla fluida y bateria duradera orientadas a productividad y entretenimiento."
    }
];

document.addEventListener("DOMContentLoaded", () => {
    const productsSection = document.querySelector("#productos");
    const loadMoreButton = document.querySelector("#boton-interactivo");
    const form = document.querySelector("#mi-formulario");
    const nameInput = document.querySelector("#nombre");
    const messageInput = document.querySelector("#mensaje");
    const submitButton = document.querySelector("#btn-enviar");
    const feedback = document.querySelector("#form-feedback");

    if (
        !productsSection ||
        !loadMoreButton ||
        !form ||
        !nameInput ||
        !messageInput ||
        !submitButton ||
        !feedback
    ) {
        return;
    }

    let extraProductsLoaded = false;

    loadMoreButton.addEventListener("click", () => {
        if (extraProductsLoaded) {
            showFeedback(
                feedback,
                "Ya se cargaron todos los modelos disponibles.",
                "success"
            );
            return;
        }

        EXTRA_PRODUCTS.forEach((product) => {
            const card = createProductCard(product);
            productsSection.insertBefore(card, loadMoreButton);
        });

        extraProductsLoaded = true;
        loadMoreButton.textContent = "Modelos cargados";
        loadMoreButton.disabled = true;
        showFeedback(
            feedback,
            "Se agregaron nuevos modelos al catalogo.",
            "success"
        );
    });

    productsSection.addEventListener("click", (event) => {
        const card = event.target.closest(".producto");

        if (!card) {
            return;
        }

        productsSection
            .querySelectorAll(".producto")
            .forEach((productCard) =>
                productCard.classList.remove("producto--seleccionado")
            );

        card.classList.add("producto--seleccionado");
    });

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        clearValidationState(nameInput, messageInput, feedback);

        const errors = validateForm(nameInput.value, messageInput.value);

        if (errors.length > 0) {
            if (errors.includes("El nombre debe tener al menos 3 caracteres.")) {
                nameInput.classList.add("is-invalid");
            }
            if (
                errors.includes("La consulta debe tener al menos 10 caracteres.")
            ) {
                messageInput.classList.add("is-invalid");
            }

            showFeedback(feedback, errors.join(" "), "error");
            return;
        }

        setSubmittingState(submitButton, true);
        showFeedback(feedback, "Enviando consulta...", "success");
        await wait(1200);

        showFeedback(
            feedback,
            "Gracias por tu consulta. Te contactaremos pronto.",
            "success"
        );
        form.reset();
        setSubmittingState(submitButton, false);
    });
});

function validateForm(nameValue, messageValue) {
    const trimmedName = nameValue.trim();
    const trimmedMessage = messageValue.trim();
    const errors = [];

    if (trimmedName.length < 3) {
        errors.push("El nombre debe tener al menos 3 caracteres.");
    }

    if (trimmedMessage.length < 10) {
        errors.push("La consulta debe tener al menos 10 caracteres.");
    }

    return errors;
}

function clearValidationState(nameInput, messageInput, feedback) {
    nameInput.classList.remove("is-invalid");
    messageInput.classList.remove("is-invalid");
    feedback.textContent = "";
    feedback.classList.remove("success", "error");
}

function showFeedback(feedbackElement, message, type) {
    feedbackElement.textContent = message;
    feedbackElement.classList.remove("success", "error");
    feedbackElement.classList.add(type);
}

function setSubmittingState(button, isSubmitting) {
    button.disabled = isSubmitting;
    button.textContent = isSubmitting ? "Enviando..." : "Enviar Formulario";
}

function wait(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

function createProductCard(product) {
    const article = document.createElement("article");
    article.className = "producto";

    const title = document.createElement("h3");
    title.textContent = product.title;

    const image = document.createElement("img");
    image.src = product.image;
    image.alt = product.title;
    image.width = 200;

    const description = document.createElement("p");
    description.textContent = product.description;

    article.append(title, image, description);
    return article;
}
