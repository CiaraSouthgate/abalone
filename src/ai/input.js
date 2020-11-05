function readInputFile() {
    let input = document.getElementById('input');
    let file = input.files[0];
    let reader = new FileReader();

    reader.readAsText(file);
    
    reader.onload = function(){
        console.log(reader.result);
    }
    reader.onerror = function(){
        console.log(reader.error);
    }
};

export default readInputFile;