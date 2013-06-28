/**
 * Takes an image location string, "pimg", and an
 * English word value string, "peng".
 * The p stands for private to differ the names with the local vars
 */
function Word (pimg, peng) {
	this.img = new Image();
	this.img.src = pimg;
	this.eng = peng;
}

easyList = [
            new Word("/imgs/vocab/dog.jpg", "dog"),
            new Word("/imgs/vocab/dog.jpg", "dog"),
            new Word("/imgs/vocab/dog.jpg", "dog"),
            new Word("/imgs/vocab/dog.jpg", "dog"),
            new Word("/imgs/vocab/dog.jpg", "dog"),
            new Word("/imgs/vocab/dog.jpg", "dog")];

