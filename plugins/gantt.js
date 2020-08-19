import Vue from "vue";
import { gantt } from "dhtmlx-gantt";

gantt.config.work_time = true;
gantt.config.duration_unit = "hour";
gantt.config.time_step = 60;
gantt.config.round_dnd_dates = false;

// normal days working hours
gantt.setWorkTime({ hours: ["8:00-16:00"] });

// setting sunday of
gantt.setWorkTime({ day: 7, hours: false });
// saturday working time
gantt.setWorkTime({ day: 6, hours: ["8:00-12:30"] });

let formatter = gantt.ext.formatters.durationFormatter({
  enter: "day",
  store: "minute", // duration_unit
  format: "day",
  hoursPerDay: 8,
  hoursPerWeek: 40,
  daysPerMonth: 30
});

// coloring days off
gantt.templates.timeline_cell_class = function(task, date) {
  if (!gantt.isWorkTime({ task: task, date: date })) return "week_end";
  return "";
};

gantt.templates.task_class = function(start, end, task) {
  if (task.status == "Pending") {
    task.color = "#909399";
  } else if (task.status == "Testing") {
    task.color = "#E6A23C";
  } else if (task.status == "In Progress") {
    task.color = "#409EFF";
  } else {
    task.color = "#67C23A";
  }
};

// setting tooltips
gantt.plugins({
  tooltip: true
});

// configuring colums
gantt.config.columns = [
  { name: "text", label: "Task Name", width: "*", tree: true, align: "left" },
  { name: "status", label: "Status", align: "center" },
  { name: "start_date", label: "Start Date", align: "center" },
  {
    name: "duration",
    label: "Duration(H)",
    resize: true,
    align: "center",
    template: function(task) {
      return formatter.format(task.duration);
    }
  }
];

//prevent moving to another sub-branch:
gantt.attachEvent("onBeforeTaskMove", function(id, parent, tindex) {
  var task = gantt.getTask(id);
  if (task.parent != parent) return false;
  return true;
});

//or
gantt.config.readonly = true;
Vue.use({ gantt });
