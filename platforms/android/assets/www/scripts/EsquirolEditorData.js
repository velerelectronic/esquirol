function mostraLlistaIndividus(id) {
    node = document.getElementById(id);
    
    listIndividusValorables(transformTableIndividus);
}

function transformTableIndividus(tx, results) {
    if (results.rows.length>0) {
        var taula = document.createElement('table');
        node.appendChild(taula);
        var td;
        var anchor;
    
        for (var i=0; i<results.rows.length; i++) {
            tr = document.createElement('tr');
            taula.appendChild(tr);

            td = document.createElement('td');
            td.appendChild( document.createTextNode(results.rows.item(i)['codi']) );
            tr.appendChild(td);

            td = document.createElement('td');
            text = results.rows.item(i)['nom1'];
            anchor = createActionAnchor(text,"editFieldIndividusValorables('Llinatges','"+text+"')");
            td.appendChild(anchor);
            tr.appendChild(td);

            td = document.createElement('td');
            text = results.rows.item(i)['nom2'];
            anchor = createActionAnchor(text,"editFieldIndividusValorables('Nom','"+text+"')");
            td.appendChild(anchor);
            tr.appendChild(td);

            td = document.createElement('td');
            text = results.rows.item(i)['nom3'];
            anchor = createActionAnchor(text,"editFieldIndividusValorables('Grup','"+text+"')");
            td.appendChild(anchor);
            tr.appendChild(td);

            td = document.createElement('td');
            text = results.rows.item(i)['text'];
            anchor = createActionAnchor(text,"editFieldIndividusValorables('Altre text','"+text+"')");
            td.appendChild(anchor);
            tr.appendChild(td);

        }
    } else {
        var p = document.createElement('p');
        p.appendChild(document.createTextNode('No hi ha individus'));
        node.appendChild(p);
    }
}

function createActionAnchor(text,action) {
    var anchor = document.createElement('a');
    anchor.appendChild( document.createTextNode(text) );
    anchor.setAttribute('onclick',action);
    return anchor;
}

function editFieldIndividusValorables(field,text) {
    var noutext = prompt(field,text);
}
