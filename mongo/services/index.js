const { db } = require("../client.js");
const { Project } = require("../schemas/index.js");

exports.validateCollection = async function createCollection() {
  db.once("open", async () => {
    console.log(
      `Connected to MongoDB Atlas. Using database: ${db.db.databaseName}`
    );
  });
};

exports.addNewClient = async function (key, value) {
  console.log(key, value, "INSIDE!");

  try {
    const isProject = await Project.findOne({ key });

    console.log(isProject);
    if (isProject) {
      isProject.value = value;
      const updatedProject = await isProject.save();

      return {
        status: 201,
        project: updatedProject,
        message: "project updated.",
      };
    } else {
      const newProject = new Project({
        key,
        value,
      });
      const savedProject = await newProject.save();

      console.log(savedProject);

      return {
        status: 200,
        project: savedProject,
        message: "project saved.",
      };
    }
  } catch (err) {
    console.log(err);

    return { status: 400, message: `${err.message}` };
  }
};

exports.getAllClients = async function () {
  try {
    const allEntries = await Project.find({});

    return { status: 200, entries: allEntries };
  } catch (err) {
    return { status: 400, message: `ERROR: ${err.message}` };
  }
};

exports.getProjectByKey = async function (key) {
  try {
    const isProject = await Project.findOne({ key });
    if (isProject) {
      return { status: 200, value: isProject.value };
    }

    return { status: 404, message: `no value found with key: ${key}` };
  } catch (err) {
    return { status: 400, message: `ERROR: ${err.message}` };
  }
};
