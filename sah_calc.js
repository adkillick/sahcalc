tables = [
"historyAndExam",
"nonContrastCT", 
"lumbarPuncture",
"angiogram"
]

function recalculate() {

    var myform = document.myform;
    var prob = myform.pretest.value;
    tables.forEach(
        (tbl, index) => {
        var name = tbl + "_table"
        var postTest = document.getElementById("p"+index)
        prob = recalculateTable(name, prob)
        postTest.innerHTML = Math.round(prob*1000)/10 + '%'
        console.log(tbl, prob)
        }
    )
}


function recalculateTable(name, pretest) {
    var myform = document.myform;
    var posttest = pretest;

    for (var i = 0; i < myform.elements.length; i++) {
        var el = myform.elements[i];
        if (el.name.substring(0,name.length) == name) {
            if (el.checked) {
                var valstring = el.value;
                var pnz = valstring.substring(0, 1);
                if (pnz == 0) { continue } //(ignore 0)
                valstring = valstring.substring(1);
                var sens = valstring.substring(0, valstring.indexOf(";"));
                var spec = valstring.substring(valstring.indexOf(";") + 1);
                if (pnz == "+") {
                    posttest = getNewP(posttest, sens, spec, 1);
                } else if (pnz == "-") {
                    posttest = getNewP(posttest, sens, spec, -1);
                }
            }
        }
    }

    return posttest;
}

function sensitivity(nr, pr) {
    return (nr * pr - pr) / (nr - pr)
}

function specificity(nr, pr) {
    return (1 - pr) / (nr - pr)
}


//Calculate a post-test probability from pretest, sens, spec, and mode
// where mode==1 is "+" test result, mode==-1 is "-" test result
function getNewP(pre, sens, spec, mode) {
    //ok, basically all we have to do is calculate that box
    /*         Disease
    * Test   +       -
    *  +     a       b
    *  -     c       d
    *
    * note that sens=a/(a+c), spec=d/(b+d), p=a+c.
    */
    var a = sens * pre;
    var c = (1 - sens) * pre;
    var d = spec * (1 - pre);
    var b = (1 - spec) * (1 - pre);

    if (mode == 1) {
        return a / (a + b);
    } else if (mode == -1) {
        return c / (c + d);
    }
}


let historyFactors = [
    { name: "Ambulance Arrival", positiveLR: 2.95, negativeLR: 0.51, sensitivity: 0.59, specificity: 0.8, ref: 2 },
    { name: "Witnessed LOC", positiveLR: 1.87, negativeLR: 0.91, sensitivity: 0.16, specificity: 0.95, ref: 2 },
    { name: "Focal Neuro Deficit", positiveLR: 3.26, negativeLR: 0.81, sensitivity: 0.31, specificity: 0.93, ref: 2 },
    { name: "Objective Neck Stiffness", positiveLR: 6.59, negativeLR: 0.78, sensitivity: 0.29, specificity: 0.96, ref: 2 },
    { name: "Subjective Neck Stiffness", positiveLR: 4.12, negativeLR: 0.73, sensitivity: 0.33, specificity: 0.95, ref: 2 },
    { name: "Exersion at onset", positiveLR: 1.7, negativeLR: 0.88, sensitivity: 0.29, specificity: 0.87, ref: 2 },
    { name: "Vomitting", positiveLR: 1.92, negativeLR: 0.52, sensitivity: 0.65, specificity: 0.72, ref: 2 },
    //{name:"Awoke from Sleep", positiveLR: 0.63, negativeLR: 1.09, sensitivity: 0.11, specificity: 0.82, ref: 2},
    { name: "Blurred Vision", positiveLR: 3.14, negativeLR: 0.85, sensitivity: 0.11, specificity: 0.95, ref: 2 },
    { name: "Burst or explode on onset", positiveLR: 1.34, negativeLR: 0.74, sensitivity: 0.58, specificity: 0.5, ref: 2 },
    //{name:"ED transfer", positiveLR: 2.2, negativeLR: 0.9, sensitivity: 0.18, specificity: 0.92, ref: 2},
    //{name:"Intercourse at onset", positiveLR: 1.2, negativeLR: 1, sensitivity: 0.07, specificity: 0.94, ref: 2},
    { name: "Worst headache of life", positiveLR: 1.25, negativeLR: 0.24, sensitivity: 0.89, specificity: 0.26, ref: 2 },
    { name: "Altered mental status", positiveLR: 2.18, negativeLR: 0.87, sensitivity: 0.27, specificity: 0.91, ref: 2 }
]
let ctFactors = [
    { name: "\< 6hours: Non contrast head CT", positiveLR: 234.55, negativeLR: 0.01, sensitivity: 1.0, specificity: 1.0, ref: 2 },
    { name: "\> 6 hours: Non contrast CT head", positiveLR: 223.37, negativeLR: 0.07, sensitivity: 0.89, specificity: 1, ref: 2 },
]
let lpFactors = [
    { name: "Xanthochromia on visual inspection", positiveLR: 12.56, negativeLR: 0.3, sensitivity: 0.71, specificity: 0.93, ref: 2 },
    { name: "RBC in tube 4 > 1000", positiveLR: 5.66, negativeLR: 0.21, sensitivity: 0.76, specificity: 0.88, ref: 2 },
]
let angioFactors = [
    { name: "Negative CT Angiogram", positiveLR: 'infinity', negativeLR: 0.02, sensitivity: 0.98, specificity: 1.0, ref: 3 },
]

let references = [
    'Perry, J. J., Stiell, I. G., Sivilotti, M. L., Bullard, M. J., Lee, J. S., Eisenhauer, M., ... & Wells, G. A. (2010). High risk clinical characteristics for subarachnoid haemorrhage in patients with acute headache: prospective cohort study. Bmj, 341.',
    'Carpenter, C. R., Hussain, A. M., Ward, M. J., Zipfel, G. J., Fowler, S., Pines, J. M., & Sivilotti, M. L. (2016). Spontaneous Subarachnoid Hemorrhage: A Systematic Review and Meta‐analysis Describing the Diagnostic Accuracy of History, Physical Examination, Imaging, and Lumbar Puncture With an Exploration of Test Thresholds. Academic Emergency Medicine, 23(9), 963-1003.',
    'Westerlaan, H. E., Van Dijk, J. M. C., Jansen-van der Weide, M. C., de Groot, J. C., Groen, R. J., Mooij, J. J. A., & Oudkerk, M. (2011). Intracranial aneurysms in patients with subarachnoid hemorrhage: CT angiography as a primary examination tool for diagnosis—systematic review and meta-analysis. Radiology, 258(1), 134-145.',
]

let makeTable = (id, factors) => {
    let table = document.getElementById(id)
    factors.forEach(
        (factor, index) => {

            var newRow = '<tr class="even" >\
            <td width="25%">\
                <a>'+ factor.name + '</a>\
            </td>\
            <td width="15%">\
                <input type="radio" name='+ id + '_table_' + index+ ' value="+' + factor.sensitivity + ';' + factor.specificity + '" onClick="recalculate()">+\
                <input type="radio" name='+ id + '_table_' + index+ ' value="0" onClick="recalculate()" checked>0\
                <input type="radio" name='+ id + '_table_' + index+ ' value="-' + factor.sensitivity + ';' + factor.specificity + '" onClick="recalculate()">-\
            </td>\
            <td width="10%">'+ factor.positiveLR + '</td>\
            <td width="10%">'+ factor.negativeLR + '</td>\
        </tr>'
            table.insertAdjacentHTML('beforeend', newRow);

        })
}