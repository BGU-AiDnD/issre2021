function showTable(fileName, type) {
    var title ="";
    var path ="";
    var classtype = "";
    fileName = fileName.toUpperCase();
    if(type == "project"){
        title = fileName;
        path = "apache_versions";
        classtype = "version";
    }else{
        type = type.toUpperCase();
        path = "versions_summary/"+type;
        classtype = "filename";
        title = type + "/" + fileName;
    }
    console.log(path+'/'+fileName + ".csv");
    $.ajax({
        url: path+'/'+fileName.toLowerCase()+'/'+fileName + ".csv",
        dataType: "text",
        success: function (data) {
            var employee_data = data.split(/\r?\n|\r/);
            var table_data = "";
            table_data += '<table class="table table-bordered table-striped table-sm" id=' + fileName+'>';
            url_cells = []
            for (var count = 0; count < employee_data.length - 1; count++) {
                var cell_data = employee_data[count].split(";");
                table_data += '<tr>';
                if (count == 0)
                    table_data += '<thead class="thead-dark">'
                for (var cell_count = 0; cell_count < cell_data.length; cell_count++) {
                    if (count === 0) {
                        table_data += '<th >' + cell_data[cell_count] + '</th>';
                        if (cell_data[cell_count].toLowerCase().includes('url')){
                            url_cells.push(cell_count);
                        }
                    }
                    else {
                        if (cell_count == 0) {
                            table_data += '<td class="' + classtype+'">';
                            table_data += '<input class="version-check-input" type="checkbox" value =' + cell_data[cell_count] + '>' + cell_data[cell_count];
                            table_data += '</td>';
                        }
                        else {
                            if(url_cells.includes(cell_count)){
                                table_data += '<td>';
                                table_data += "<a href=" + cell_data[cell_count] + ">" + cell_data[cell_count] +"</a>"; 
                                table_data += '</td>';
                            }
                            else
                                table_data += '<td>' + cell_data[cell_count] + '</td>';
                        }
                    }
                }
                if (count == 0)
                    table_data += '</thead>'
                table_data += '</tr>';
            }
            table_data += '</table>';
            $('.tableWrapper').html(table_data);
            document.getElementById("projectTitle").innerHTML = title;
            document.getElementById("csvbutton").style.visibility = "visible";
        },
        error: function(error){
            console.log(error);
        }
    });
}


const tableToCSV = table => {
    const headers = Array.from(table.querySelectorAll('th'))
        .map(item => item.innerText).join(',')

    const rows = Array.from(table.querySelectorAll('tr'))
        .reduce((arr, domRow) => {
            if (domRow.querySelector('th')) return arr

            const cells = Array.from(domRow.querySelectorAll('td'))
                .map(item => item.innerText)
                .join(',')

            return arr.concat([cells])
        }, [])

    return headers + '\n' + rows.join('\n')
}

const downloadCSV = csv => {
    const csvFile = new Blob([csv], { type: 'text/csv' })
    const downloadLink = document.createElement('a')

    downloadLink.download = `${document.getElementById("projectTitle").innerHTML}.csv`
    downloadLink.href = window.URL.createObjectURL(csvFile)
    downloadLink.style.display = 'none'
    document.body.appendChild(downloadLink)

    downloadLink.click()
}

document.querySelector('#csvbutton').addEventListener('click', () => {
    const table = document.querySelector('table')
    const csv = tableToCSV(table)
    return downloadCSV(csv)
})

