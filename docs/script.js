$(document).ready(function(){
    $.getJSON("/stats.json", function(data){
        let statsdata = '';
        $.each(data, function(key, value) {
            statsdata += '<tr>';
            statsdata += '<td>'+value.name+'</td>';
            statsdata += '<td>'+value.total+'</td>';
            statsdata += '</tr>';
        });
        $('#magic8table').append(statsdata);
    });
});
