<template>
  <div class="scadule">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <div>
        <h4>Schedule</h4>
        <p>Deskripsi singkat di sini</p>
      </div>
    <router-link to="/kk" class="btn btn-outline-secondary">+ New Project</router-link>
    </div>

    <div class="wrap">
      <div class="left">
        <DayPilotNavigator :config="navigatorConfig" />
      </div>
      <div class="content">
        <DayPilotCalendar :config="calendarConfig" ref="calendarRef" />
      </div>
    </div>
  </div>
</template>

<script setup>
import {DayPilot, DayPilotCalendar, DayPilotNavigator} from '@daypilot/daypilot-lite-vue';
import { ref, reactive, onMounted } from 'vue';

const navigatorConfig = reactive({
  selectMode: "Week",
  showMonths: 1,
  skipMonths: 1,
  startDate: "2025-03-01",
  selectionDay: "2025-02-28",
  onTimeRangeSelected: args => {
    calendarConfig.startDate = args.day;
  }
});

const calendarConfig = reactive({
  viewType: "Week",
  startDate: "2025-02-28",
  durationBarVisible: false,
  timeRangeSelectedHandling: "Enabled",
  onTimeRangeSelected: async (args) => {
    const modal = await DayPilot.Modal.prompt("Create a new event:", "Event 1");
    const dp = args.control;
    dp.clearSelection();
    if (modal.canceled) {
      return;
    }
    dp.events.add({
      start: args.start,
      end: args.end,
      id: DayPilot.guid(),
      text: modal.result
    });
  },
  contextMenu: new DayPilot.Menu({
    items: [
      {text: "Delete", onClick: args => {
        const dp = calendarRef.value.control;
        dp.events.remove(args.source);
      }}
    ]
  }),
  onBeforeEventRender: args => {
    args.data.areas = [
      {
        right: 5,
        top: 7,
        width: 25,
        height: 25,
        backColor: "#285480",
        fontColor: "#666666",
        padding: 4,
        symbol: "/icons/daypilot.svg#threedots-v",
        style: "border-radius: 50%;",
        action: "ContextMenu",
      }
    ];
  },
  eventDeleteHandling: "Disabled",
  onEventMoved: () => {
    console.log("Event moved");
  },
  onEventResized: () => {
    console.log("Event resized");
  },
});

const calendarRef = ref(null);

const loadEvents = () => {
  const events = [
    {
      id: 1,
      start: "2025-02-24T10:00:00",
      end: "2025-02-24T11:00:00",
      text: "Event 1",
      backColor: "#6aa84f",
      borderColor: "#569838",
    },
    {
      id: 2,
      start: "2025-02-24T13:00:00",
      end: "2025-02-24T16:00:00",
      text: "Event 2",
      backColor: "#f1c232",
      borderColor: "#d5a715",
    },
    {
      id: 3,
      start: "2025-02-25T13:30:00",
      end: "2025-02-25T16:30:00",
      text: "Event 3",
      backColor: "#da5c41",
      borderColor: "#cc4125",
    },
    {
      id: 4,
      start: "2025-02-25T10:30:00",
      end: "2025-02-25T12:30:00",
      text: "Event 4",
    },
  ];
  calendarConfig.events = events;
};

// Fungsi untuk membuat event baru
const createNewEvent = async () => {
  const modal = await DayPilot.Modal.prompt("Create a new event:", "New Event");
  if (modal.canceled) {
    return;
  }
  const newEvent = {
    id: DayPilot.guid(),
    start: "2025-02-26T09:00:00", // Tentukan waktu default event baru
    end: "2025-02-26T10:00:00",
    text: modal.result,
    backColor: "#009688",
    borderColor: "#00796b",
  };
  const dp = calendarRef.value.control;
  dp.events.add(newEvent);
};

onMounted(() => {
  loadEvents();
});
</script>

<style>
.wrap {
  display: flex;
}

.left {
  margin-right: 10px;
}

.content {
  flex-grow: 1;
}

.calendar_default_event_inner {
  background: #2e78d6;
  border-color: #0a5cd2;
  color: white;
  border-radius: 5px;
  opacity: 0.9;
}
</style>