const fs = require('fs');
const path = require('path');

// 1. Controller
let controllerStr = fs.readFileSync('../../server/controllers/adminController.js', 'utf8');
let dawaMatch = controllerStr.match(/export const dawaDashboardStats = catchAsyncError\([\s\S]+?\n\}\);\s*\n/);
if (dawaMatch) {
  let schoolFunc = dawaMatch[0]
  .replace(/dawaDashboardStats/g, 'schoolDashboardStats')
  .replace(/Uthmaniyya College\.\.\./g, 'Academic')
  .replace(/Uthmaniyya College of Excellence/g, 'Academic')
  .replace(/dawa_students/g, 'school_students')
  .replace(/dawa_admissions/g, 'school_admissions');
  
  if (!controllerStr.includes('schoolDashboardStats')) {
    fs.writeFileSync('../../server/controllers/adminController.js', controllerStr + '\n' + schoolFunc);
  }
}

// 2. Routes
let routes = fs.readFileSync('../../server/router/adminRouts.js', 'utf8');
if (!routes.includes('schoolDashboardStats')) {
    routes = routes.replace('dawaDashboardStats', 'dawaDashboardStats, schoolDashboardStats');
    routes = routes.replace('router.get("/dawa/deshboard/status", dawaDashboardStats);', 'router.get("/dawa/deshboard/status", dawaDashboardStats);\nrouter.get("/school/deshboard/status", schoolDashboardStats);');
    fs.writeFileSync('../../server/router/adminRouts.js', routes);
}

// 3. Redux Config
let slice = fs.readFileSync('./store/slices/deshboarSlice.js', 'utf8');
if (!slice.includes('schoolDashboardStats')) {
    let sliceMatch = slice.match(/export const dawaDashboardStats = \(\) => async \(dispatch\) => \{[\s\S]+?\}\n\}/);
    if(sliceMatch) {
        let newAct = sliceMatch[0].replace(/dawaDashboardStats/g, 'schoolDashboardStats').replace('/dawa/deshboard/status', '/school/deshboard/status').replace('dawaDashboardStatsFaile', 'schoolDashboardStatsFaile');
        
        let reducersPart = `
    schoolDashboardStatsRequest: (state) => {
      state.loading = true;
    },
    schoolDashboardStatsSuccess: (state, action) => {
      state.loading = false;
      state.cards = action.payload.cards;
      state.today = action.payload.today;
      state.charts = action.payload.charts;
    },
    schoolDashboardStatsFaile: (state) => {
      state.loading = false;
    },`;
        slice = slice.replace('dawaDashboardStatsFaile: (state) => {\n      state.loading = false;\n    },', 'dawaDashboardStatsFaile: (state) => {\n      state.loading = false;\n    },' + reducersPart);
        
        slice = slice.replace('dawaDashboardStatsFaile,', 'dawaDashboardStatsFaile,\n  schoolDashboardStatsRequest,\n  schoolDashboardStatsSuccess,\n  schoolDashboardStatsFaile,');
        
        slice = slice + '\n' + newAct;
        fs.writeFileSync('./store/slices/deshboarSlice.js', slice);
    }
}

// 4. Copydir
const srcDir = './components/dawa';
const destDir = './components/school';
if(!fs.existsSync(destDir)) fs.mkdirSync(destDir);
const files = fs.readdirSync(srcDir);
files.forEach(f => {
    let content = fs.readFileSync(path.join(srcDir, f), 'utf8');
    content = content.replace(/Dawa/g, 'School')
                     .replace(/dawa/g, 'school')
                     .replace(/Uthmaniyya College\.\.\./g, 'Academic');
    
    // special fixes
    content = content.replace(/Uthmaniyya College of Excellence/g, 'Academic');
    
    let destF = f.replace(/Dawa/g, 'School');
    fs.writeFileSync(path.join(destDir, destF), content);
});

// 5. App.jsx
let app = fs.readFileSync('./App.jsx', 'utf8');
if (!app.includes('SchoolDeshboard')) {
    app = app.replace(/\/\/Dawa Components\r?\n/, '//School Components\nimport SchoolDeshboard from "./components/school/SchoolDeshboard";\nimport SchoolStudents from "./components/school/SchoolStudents";\nimport SchoolResult from "./components/school/SchoolResult";\n\n//Dawa Components\n');
    let blockMatch = app.match(/\/\* DAWA DASHBOARD CONTENT \*\/[\s\S]+?\}\;\n/);
    if (blockMatch) {
       let newBlock = blockMatch[0].replace(/DAWA/g, 'SCHOOL')
                                   .replace(/dawa/g, 'school')
                                   .replace(/Dawa/g, 'School');
       app = app.replace(blockMatch[0], blockMatch[0] + '\n' + newBlock);
    }
    app = app.replace('if (user?.role === "Admin" || user?.role === "School") {', 'if (user?.role === "Admin") {');

    let schoolLayout = `
    //SCHOOL
    if (user?.role === "School") {
      return (
        <div className="flex min-h-screen">
          <StaffSideBar />
          {schoolRenderDashboardContent()}
        </div>
      );
    }`;
    app = app.replace('// DEFAULT', schoolLayout + '\n    // DEFAULT');

    fs.writeFileSync('./App.jsx', app);
}

console.log("Done");
