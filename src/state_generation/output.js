
let textfile = null;
// Creates output file for download
const createOutputFile = text => {
    let data = new Blob([text], {type: 'text/plain'});

    //if (textfile != null) {
    window.URL.revokeObjectURL(textfile);
    //}

    textfile = window.URL.createObjectURL(data);
    // Returns URL to the data
    return textfile;
}

export const downloadTextfile = (data, filename) => {
    let link = document.createElement('a');
    link.setAttribute('download', filename);
    link.href = createOutputFile(data);
    link.hidden = true;
    document.body.appendChild(link);

    window.requestAnimationFrame(() => {
        let event = new MouseEvent('click');
        link.dispatchEvent(event);
        document.body.removeChild(link);
    });
}
