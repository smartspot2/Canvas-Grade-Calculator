function parseText() {
    let text = document.getElementById("copypastefield").value;

    // Split every line
    let textSplit = text.split('\n');
    textSplit = textSplit.map(s => s.trim());

    // Check for miscopied text; alert and don't proceed if incorrect copy-paste

    if (textSplit.includes("Name	Due	Status	Score	Out of	Details	Submission Progress Status")) {
        alert("You have copied the wrong page; please copy-paste the 'Assignments' page in Canvas.");
        return;
    } else if (textSplit.includes("Undated Assignments") || textSplit.includes("Past Assignments")) {
        alert("You have copied the assignments sorted by date. Please click on 'SHOW BY TYPE' in the top-right corner of the assignments page and try again.");;
        return;
    }

    // Remove everything before assignments
    if (textSplit.some(l => {return l.includes("SHOW BY TYPE")})) {
        textSplit.splice(0, 1 + textSplit.findIndex(l => {return l.includes("SHOW BY TYPE")}));
    } else {
        textSplit.splice(0, 3 + textSplit.indexOf("Show By"));
    };

    // Create assignments
    this.assignments = new AssignmentList();
    this.categories = new CategoryList();

    let lastAssignment = "";
    let lastCategory = "";
    textSplit.forEach(line => {
        if (lastCategory == "" || line.includes("% of Total")) {
            // Should only occur at the beginning of the loop
            let category = parseCategory(line);
            let catObj = new Category(category.name, category.weight);
            categories.add(catObj);
            lastCategory = catObj;
        } else if (line.includes('Due')) {  // Due Date
            curAsgnmt = assignments.find(lastAssignment);
            if (line.includes('pts')) { // Due date and points on same line
                let lineSplit = line.split(" ");
                let ptsIndex = lineSplit.indexOf("pts");
                
                dueStr = lineSplit.slice(0, ptsIndex-1).join(' ');
                scoreStr = lineSplit.slice(ptsIndex-1).join(' ');

                curAsgnmt.score = parseScore(scoreStr);
                line = dueStr;
            }
            curAsgnmt.due = line;
        } else if (line.includes('pts')) {  // Score
            assignments.find(lastAssignment).score = parseScore(line);
        } else if (isAssignmentTag(line)) { // Tag
            assignments.find(lastAssignment).tag = line;
        } else {                            // Assignment Name
            let curAssignment = new Assignment(line);
            assignments.add(curAssignment);
            curAssignment.category = lastCategory.name;
            lastCategory.add(curAssignment);
            lastAssignment = line;
        }
    });

    // Make weight list object
    this.weights = new WeightList();

    categories.arr.forEach(cat => {
        weights[cat.name] = cat.weight;
    });

    // Display assignments as HTML elements
    makeHTMLAssignments();
    makeHTMLWeights();

    // Calculate grade
    calculateGrade();

    // Uncollapse step 2 and collapse step 1
    $("#step1").hide();
    $("#step2").show();
}

function parseScore(line) {
    strSplit = line.split(" ");
    frac = strSplit[0].split('/');

    outOf = parseFloat(frac[1]);

    if (frac[0] == '-') {
        points = null;
    } else {
        points = parseFloat(frac[0]);
    }

    return [points, outOf];
}

function parseCategory(line) {
    let splitStr = line.split(' ');
    let percentIndex = splitStr.findIndex(s => s.includes("%"));
    let nameStr = splitStr.slice(0, percentIndex).join(" ");
    let percent = splitStr[percentIndex];
    // Get only number
    percent = parseFloat(percent.substr(0, percent.length-1))*0.01;
    return {name: nameStr, weight: percent};
}

function isAssignmentTag(line) {
    if (line == 'Closed') {
        return true;
    }
    return false;
}