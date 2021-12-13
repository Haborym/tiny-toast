class Toast {

    /**
     *
     * Create a Toast Object
     *
     * @constructor
     *
     * @param {string} id   Id given to the Toast
     * @param {string} ty   Type of the Toast
     * @param {string} ic   Icon of the Toast
     * @param {string} te   Text of the Toast
     * @param {boolean} d   Is the Toast dismisible ?
     * @param {boolean} ani Is the icon animated ?
     *
     */
    constructor(id, ty, ic, te, d = false, ani = false) {

        // Error verifications
        /**
         * Function that throws Error if it is not formatted correctly
         */
        this.verification(id, ty, ic, d, ani);

        // Initializations
        /**
         * Id of the Toast on the DOM so it can be used on custom JS script
         * @type {string}
         */
        this.id = id;

        /**
         * The type indicates the color of the Toast
         * @type {string}
         */
        this.type = 'info';
        let a_types = ['info', 'success', 'warning', 'error'];
        if (!a_types.includes(ty.trim().toLowerCase())) {
            this.type = 'info';
        } else {
            this.type = ty.trim().toLowerCase();
        }

        /**
         * Icon of the Toast
         * @type {string}
         */
        this.icon = ic.trim().toLowerCase();

        /**
         * Text of the Toast
         * @type {string}
         */
        this.text = te.trim();

        /**
         * Indicates if the Toast is Dismissible
         * @type {boolean}
         */
        this.dismissible = d;

        /**
         * Indicates if the Toast has been built
         * @type {boolean}
         */
        this.is_build = false;

        /**
         * Indicates if the Icon is animated
         * @type {boolean}
         */
        this.isAnimated = ani;

        /**
         * DOM element that contain the Toast
         * @type {HTMLDivElement}
         */
        this.html_toast = null;

        /**
         * Custom margin that is applied for each Toast created so it won't overlap with the other ones
         * @type {number}
         */
        this.customMargin = 15;
    }

    /**
     *
     * Create the HTML element of the Toaster with the values of the object
     * and display it on the DOM
     *
     * @returns {void}
     */
    show() {
        if (!this.is_build) // the toast is not build
        {
            this.html_toast = this.generate();
            this.is_build = true;
        } else //the toast is build and need to be cleared of the old classes
        {
            this.refresh();
        }

        // adding the DOM Element to the body of the Document
        document.body.append(this.html_toast);
        if (!this.dismissible) //adding the class to display and the remove it once the animation is finished
        {
            this.html_toast.classList.add('tiny-toast-show');
            setTimeout(() => {
                this.hide(this.id);
            }, 5000);
        } else //adding the class to display and then setting it on the viewport
        {
            this.html_toast.classList.add('tiny-toast-stay');
        }
    }

    /**
     *
     * Build the HTML Toast
     *
     * @returns {HTMLDivElement}
     */
    generate() {
        //creating a global div
        const el = document.createElement('div');
        el.setAttribute('id', this.id);
        el.classList.add('tiny-toast', 'toast-' + this.type);

        //creating a global Icon Div
        const elImg = document.createElement('div');
        elImg.setAttribute('id', this.id + 'Img');
        elImg.classList.add('tiny-toast-img', 'toast-img-' + this.type);
        //creating icon
        const elImgIcon = document.createElement('i');
        elImgIcon.setAttribute('id', this.id + 'ImgIcon');

        elImgIcon.classList.add('tiny-toast-icon', 'fa');
        if (this.isAnimated)
        {
            elImgIcon.classList.add('tiny-toast-animated');
        }

        this.icon.split(' ').forEach((e) => {
            elImgIcon.classList.add(e);
        });

        //adding the icon to the div
        elImg.appendChild(elImgIcon);

        //creating a global div to hold the description
        const elDesc = document.createElement('div');
        elDesc.setAttribute('id', this.id + 'Desc');
        elDesc.classList.add('tiny-toast-desc');

        //creating the div that contain the text
        const elDescText = document.createElement('div');
        elDescText.setAttribute('id', this.id + 'DescText');
        elDescText.innerText = this.text;

        //adding the div with the tet to the descriptive div
        elDesc.appendChild(elDescText);

        if (this.dismissible) //if the toast is dismissible, then when add a cross tho close the toast
        {
            elDesc.classList.add("toast-dismissible");

            //creating the div that contain the dismiss button
            const elDescDismiss = document.createElement('span');
            elDescDismiss.setAttribute('id', this.id + 'DescText');
            elDescDismiss.setAttribute('data-toast-id', this.id);
            elDescDismiss.classList.add('toast-close-btn');
            elDescDismiss.innerHTML = '&times';

            //adding the dismiss button to the descriptive div
            elDesc.appendChild(elDescDismiss);
        }

        //adding the global Icon div and the global descriptive div to the Global div
        el.appendChild(elImg);
        el.appendChild(elDesc);

        let idPredecessor = this.getIdPredecessor();
        if (idPredecessor !== "") // the predecessor exists
        {
            // adding a margin to the Toast
            el.style.marginTop = this.generateCustomCss(idPredecessor);
        }

        return el;
    }

    /**
     * Clear the Object and reset it with the creation values
     */
    refresh() {
        this.html_toast.classList.remove('toast-hide', 'tiny-toast-show', 'tiny-toast-stay');
        this.html_toast.children[1].hidden = false;
    }

    /**
     *
     * Hide the designed Toast given the Id as parameter
     *
     * @param {string} toastId
     *
     * @returns {void}
     *
     */
    hide(toastId) {
        const toast = document.getElementById(toastId);

        toast.style.minWidth = '350px';

        //hidding the Desc content of the Toast
        toast.children[1].classList.add('hide-content');
        toast.children[1].hidden = true;
        //hidding the Icon of the Toast
        toast.classList.add("toast-hide");

        setTimeout(() => {
            //removing the element to the DOM
            toast.remove();
        }, 2000);

        this.update();
    }

    /**
     *
     * Same function as hide but for the static call.
     * Does not trigger the update function :(
     *
     * @param toastId
     *
     * @returns {void}
     */
    static staticHidding(toastId) {
        const toast = document.getElementById(toastId);

        toast.style.minWidth = '350px';

        // hidding the text of the Toast
        toast.children[1].classList.add('hide-content');
        toast.children[1].hidden = true;
        //hidding the Icon of the Toast
        toast.classList.add("toast-hide");

        setTimeout(() => {
            //removing the element to the DOM
            toast.remove();
        }, 2000);
    }

    /**
     * Given the id of the Toast that precedes the one being build, create a custom margin-top
     *
     * @param {string} id Id of the DOM element of the Toast
     *
     * @returns {string}
     */
    generateCustomCss(id) {
        let cssEl = getComputedStyle(document.getElementById(id));
        return parseInt(cssEl.marginTop) + parseInt(cssEl.height) + this.customMargin + "px";
    }

    /**
     * Return the Id of the last created Toast
     *
     * @returns {string}
     */
    getIdPredecessor() {
        const el = document.getElementsByClassName('tiny-toast');
        return (el.length === 0) ? "" : el[el.length - 1].id;
    }

    /**
     *
     * Update the position of all the Toast displaye don the viewport once one is removed
     *
     * @returns {void}
     */
    update() {
        let toasts = document.getElementsByClassName('tiny-toast');

        for (let i = 0; i < toasts.length; i++) {
            if (i === 0) {
                toasts[i].style.removeProperty('margin-top');
            } else {
                toasts[i].style.marginTop = this.generateCustomCss(toasts[i - 1].id);
            }
        }
    }

    /**
     * Verify if the arguments matches the object's variables
     *
     * @param {string} id   Id given to the Toast
     * @param {string} ty   Type of the Toast
     * @param {string} ic   Icon of the Toast
     * @param {boolean} d   Determine if the Toast is dismissible
     * @param {boolean} ani Determine if there is an animation played on the Icon
     *
     * @throws {TypeError}  If argument does not match configuration
     * @throws {Error}      If Id is already used
     *
     * @returns {void}
     */
    verification(id, ty, ic, d, ani) {
        if (!!document.getElementById(id)) {
            throw Error('ID given is already in use');
        }
        if (typeof id !== "string") {
            throw TypeError('ID must be a string');
        }

        if (typeof ty !== "string") {
            throw TypeError('Type must be a string');
        }

        if (typeof ic !== "string") {
            throw TypeError('Icone must be a string');
        }

        if (typeof d !== "boolean") {
            throw TypeError('Dismissible must be a boolean');
        }

        if (typeof ani !== "boolean") {
            throw TypeError('Animation must be a boolean');
        }
    }
}

/*
 *  Event listener that is binded to every Toast that can be created
 *  In this case it detect if the User is trying to close a dismissible Toast
 */
document.addEventListener('click', function (e) {
    if (!e.target.classList.contains('toast-close-btn')) {
        return;
    }
    Toast.staticHidding(e.target.dataset.toastId);
}, false);