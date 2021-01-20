<template>
  <div class="config-settings">
    <VuePerfectScrollbar :style="{ height: height + 'px' }" v-if="currentCellConfigs.rawConfigs">
        <cell-config-setting-template
            @add-y-axis="addYAxis"
            @change-column-setting="changeColumnSetting"
            v-for="(item, settingName) in currentCellConfigs.rawConfigs.setting"
            :key="settingName"
            :settingItem="item"
            :selectedCell="currentCellConfigs"
            :settingTplAgg="settingTplAgg"
        >
      </cell-config-setting-template>
    </VuePerfectScrollbar>
  </div>
</template>
<script>
import CellConfigSettingTemplate from "@/components/dashboard/components/reportConfig/CellConfigSettingTemplate";
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import settingTplAgg from "@/components/dashboard/configPool/settingTplAgg";
import PieChart from "@/components/dashboard/reports/Pie.chart.js";
import DonutChart from "@/components/dashboard/reports/Donut.chart.js";
import TreemapChart from "@/components/dashboard/reports/Treemap.chart.js";

export default {
    components: {
        CellConfigSettingTemplate: CellConfigSettingTemplate,
        VuePerfectScrollbar,
    },
    props: {
        instanceKey: {
            type: Number,
            default: 0,
        },
        height: {
            type: Number,
            default: 0,
        },
    },
  created() {
    // let pie = new PieChart()
    // let output = pie.translate(this.testData.rawConfigs, this.testData.sharedConfigs.data)
    // debugger
    // let donut = new DonutChart()
    // let outputDonut = donut.translate(this.testData.rawConfigs, this.testData.sharedConfigs.data)
    // debugger
    // let treeMap = new TreemapChart();
    //   let outputDonut = treeMap.translate(
    //   this.testDataTreemap.rawConfigs,
    //   this.testDataTreemap.sharedConfigs.data
    // );
    // debugger
  },
  methods: {
    addYAxis(newLast) {
      let newYAxis = JSON.parse(JSON.stringify(this.settingItems.yAxis1));
      newYAxis.selectedColums = [];
      newYAxis.num = newLast;
      newYAxis.name = "Y Axis " + newLast;

        let tooltips = this.settingItems.tooltips;
        delete this.settingItems.tooltips;
        this.$set(this.settingItems, "yAxis" + newLast, newYAxis);
        this.$set(this.settingItems, "tooltips", tooltips);
        for (let name in this.settingItems) {
            if (name.includes("yAxis")) {
            this.settingItems[name].lastYaxis = newLast;
            }
        }
        },
    changeColumnSetting() {
      window.SDashboardEditor.onChangeCellConfigs("column");
    },
  },
  data() {
    return {
      cpnType: "config_setting",
      settingItems: {},
      settingTplAgg: settingTplAgg,
      testData: {
        sharedConfigs: {
          type: "pie",
          yAxisCount: 1,
          cellId: "cell-1608884881484",
          data: [
            {
              "TRẠNG THÁI": "APPROVED",
              NGÀY: "2021-01-13",
              "Số lượng": 19,
            },
            {
              "TRẠNG THÁI": "FIXED",
              NGÀY: "2020-01-08",
              "Số lượng": 87,
            },
            {
              "TRẠNG THÁI": "QA LEAD APPROVED",
              NGÀY: "2021-01-12",
              "Số lượng": 1,
            },
            {
              "TRẠNG THÁI": "REVIEWING",
              NGÀY: "2020-10-16",
              "Số lượng": 18,
            },
            {
              "TRẠNG THÁI": "RE-OPEN",
              NGÀY: "2020-08-17",
              "Số lượng": 4,
            },
            {
              "TRẠNG THÁI": "TO DO",
              NGÀY: "2020-08-17",
              "Số lượng": 19,
            },
            {
              "TRẠNG THÁI": "NEW",
              NGÀY: "2020-02-12",
              "Số lượng": 144,
            },
            {
              "TRẠNG THÁI": "WIP",
              NGÀY: "2020-11-21",
              "Số lượng": 5,
            },
            {
              "TRẠNG THÁI": "TESTING",
              NGÀY: "2020-08-17",
              "Số lượng": 22,
            },
          ],
          total: 0,
        },
        rawConfigs: {
          setting: {
            legend: {
              name: "Legend",
              slot: "1",
              selectedColums: [
                {
                  as: "TRẠNG THÁI",
                  agg: "count",
                  cond: {
                    val: "",
                    type: "isall",
                  },
                  edit: false,
                  name: "ttsd",
                  type: "text",
                  dataset: "3614",
                  origin_type: "text",
                },
              ],
            },
            tooltips: {
              name: "Tooltips",
              slot: "n",
              hasAgg: true,
              selectedColums: [
                {
                  as: "NGÀY",
                  agg: "first",
                  cond: {
                    val: "",
                    type: "isall",
                  },
                  edit: false,
                  name: "ngay",
                  type: "date",
                  dataset: "3614",
                  origin_type: "date",
                },
              ],
            },
            yAxis1: {
              name: "Y Axis 1",
              slot: "1",
              hasAgg: true,
              lastYaxis: 1,
              selectedColums: [
                {
                  as: "Số lượng",
                  agg: "count",
                  cond: {
                    val: "",
                    type: "isall",
                  },
                  edit: false,
                  name: "ma_module",
                  type: "text",
                  dataset: "3614",
                  origin_type: "text",
                },
              ],
            },
          },
          style: [
            {
              label: "Legend",
              name: "legend",
              show: true,
              children: {
                show: {
                  label: "Show",
                  type: "switch",
                  default: true,
                  value: true,
                  name: "show",
                },
                name: {
                  label: "Name",
                  type: "text",
                  default: "",
                  value: "",
                  name: "name",
                },
                legendPosition: {
                  label: "Position",
                  type: "btnSelect",
                  default: "vertical-bottom",
                  options: [
                    {
                      name: "Left",
                      icon: "ms-Icon ms-Icon--AlignHorizontalLeft",
                      value: "vertical-left",
                      text: "",
                    },
                    {
                      name: "Top",
                      icon: "ms-Icon ms-Icon--AlignVerticalTop",
                      value: "horizontal-top",
                      text: "",
                    },
                    {
                      name: "Right",
                      icon: "ms-Icon ms-Icon--AlignHorizontalRight",
                      value: "vertical-right",
                      text: "",
                    },
                    {
                      name: "Bottom",
                      icon: "ms-Icon ms-Icon--AlignVerticalBottom",
                      value: "horizontal-bottom",
                      text: "",
                    },
                  ],
                  value: "vertical-left",
                  name: "legendPosition",
                },
                fontColor: {
                  label: "Font Corlor",
                  type: "color",
                  default: "#344750",
                  value: "#344750",
                  name: "fontColor",
                },
                textSize: {
                  label: "Text Size",
                  type: "number",
                  default: "13",
                  value: 12,
                  name: "textSize",
                },
                showLegendTitle: {
                  label: "Show Legend Title",
                  type: "switch",
                  default: true,
                  value: false,
                  name: "showLegendTitle",
                },
                titleText: {
                  label: "Title text",
                  type: "text",
                  default: "",
                  value: "",
                  name: "titleText",
                },
              },
            },
            {
              label: "Data label",
              name: "pieDetailLabel",
              show: true,
              children: {
                show: {
                  label: "Show",
                  type: "switch",
                  default: true,
                  value: true,
                  name: "show",
                },
                pieLableStyle: {
                  label: "Label style",
                  type: "select",
                  default: "category",
                  options: [
                    {
                      value: "category",
                      text: "Category",
                    },
                    {
                      value: "value",
                      text: "Data value",
                    },
                    {
                      value: "percent",
                      text: "percent",
                    },
                    {
                      value: "categoryPercent",
                      text: "Category, percent",
                    },
                    {
                      value: "valuePercent",
                      text: "Data value, percent",
                    },
                    {
                      value: "all",
                      text: "All detail",
                    },
                  ],
                  value: "categoryPercent",
                  name: "pieLableStyle",
                },
                fontColor: {
                  label: "Font Corlor",
                  type: "color",
                  default: "#344750",
                  value: "#344750",
                  name: "fontColor",
                },
                textSize: {
                  label: "Text Size",
                  type: "number",
                  default: "13",
                  value: 11,
                  name: "textSize",
                },
                bgColor: {
                  label: "Background Corlor",
                  type: "color",
                  default: "#ffffff",
                  value: "#ffffff",
                  name: "bgColor",
                },
                borderWidth: {
                  label: "Border Width",
                  type: "number",
                  default: 0,
                  value: 0,
                  name: "borderWidth",
                },
                borderColor: {
                  label: "Border Corlor",
                  type: "color",
                  default: "#000000",
                  value: "#000000",
                  name: "borderColor",
                },
                tooltipDecimalNumber: {
                  label: "Decimal number",
                  type: "number",
                  default: 2,
                  value: 2,
                  name: "tooltipDecimalNumber",
                },
              },
            },
            {
              label: "General",
              name: "general",
              show: true,
              children: {
                fontFamily: {
                  label: "Font family",
                  type: "select",
                  default: "roboto",
                  options: [
                    {
                      value: "roboto",
                      text: "Roboto",
                    },
                  ],
                  value: "roboto",
                  name: "fontFamily",
                },
                bgColor: {
                  label: "Background Corlor",
                  type: "color",
                  default: "#ffffff",
                  value: "rgba(255, 255, 255)",
                  name: "bgColor",
                },
                borderWidth: {
                  label: "Border Width",
                  type: "number",
                  default: 0,
                  value: "1",
                  name: "borderWidth",
                },
                borderColor: {
                  label: "Border Corlor",
                  type: "color",
                  default: "#000000",
                  value: "rgba(216, 216, 216, 1)",
                  name: "borderColor",
                },
                colorPalette: {
                  label: "Color palette",
                  type: "colorArray",
                  default: [],
                  value: [
                    "rgba(37, 128, 57, 1)",
                    "rgba(245, 190, 65, 1)",
                    "rgba(207, 55, 33, 1)",
                    "rgba(49, 169, 184, 1)",
                    "rgba(191, 191, 191, 1)",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                  ],
                  name: "colorPalette",
                },
              },
            },
            {
              label: "Title",
              name: "title",
              show: true,
              children: {
                show: {
                  label: "Show",
                  type: "switch",
                  default: true,
                  value: true,
                  name: "show",
                },
                titleText: {
                  label: "Title text",
                  type: "text",
                  default: "",
                  value: "Số lượng bug theo status",
                  name: "titleText",
                },
                fontColor: {
                  label: "Font Corlor",
                  type: "color",
                  default: "#344750",
                  value: "#344750",
                  name: "fontColor",
                },
                textSize: {
                  label: "Text Size",
                  type: "number",
                  default: "13",
                  value: 14,
                  name: "textSize",
                },
                alignment: {
                  label: "Alignment",
                  type: "btnSelect",
                  default: "left",
                  options: [
                    {
                      name: "left",
                      icon: "ms-Icon ms-Icon--AlignHorizontalLeft",
                      value: "left",
                      text: "",
                    },
                    {
                      name: "center",
                      icon: "ms-Icon ms-Icon--AlignHorizontalCenter",
                      value: "center",
                      text: "",
                    },
                    {
                      name: "right",
                      icon: "ms-Icon ms-Icon--AlignHorizontalRight",
                      value: "right",
                      text: "",
                    },
                  ],
                  value: "center",
                  name: "alignment",
                },
                bgColor: {
                  label: "Background Corlor",
                  type: "color",
                  default: "#ffffff",
                  value: "rgba(255, 255, 255, 1)",
                  name: "bgColor",
                },
              },
            },
          ],
          condition: [
            {
              as: "TRẠNG THÁI",
              agg: "first",
              cond: {
                val: "",
                type: "notblank",
              },
              edit: false,
              name: "ttsd",
              type: "text",
              dataset: "3614",
              validValue: true,
              origin_type: "text",
            },
            {
              as: "MODULE",
              agg: "first",
              cond: {
                val: "",
                type: "notblank",
              },
              edit: false,
              name: "ma_module",
              type: "text",
              dataset: "3614",
              validValue: true,
              origin_type: "text",
            },
            {
              as: "TRẠNG THÁI",
              agg: "first",
              cond: {
                val: "DONE",
                type: "isnot",
              },
              edit: false,
              name: "ttsd",
              type: "text",
              dataset: "3614",
              validValue: true,
              origin_type: "text",
            },
            {
              as: "TRẠNG THÁI",
              agg: "first",
              cond: {
                val: "BACKLOG",
                type: "isnot",
              },
              edit: false,
              name: "ttsd",
              type: "text",
              dataset: "3614",
              validValue: true,
              origin_type: "text",
            },
            {
              as: "TRẠNG THÁI",
              agg: "first",
              cond: {
                val: "CLOSED",
                type: "isnot",
              },
              edit: false,
              name: "ttsd",
              type: "text",
              dataset: "3614",
              validValue: true,
              origin_type: "text",
            },
            {
              as: "TRẠNG THÁI",
              agg: "first",
              cond: {
                val: "ON-HOLD",
                type: "isnot",
              },
              edit: false,
              name: "ttsd",
              type: "text",
              dataset: "3614",
              validValue: true,
              origin_type: "text",
            },
          ],
          extra: {},
        },
        viewConfigs: {
          isSelecting: false,
          selectedDataset: {
            3614: {
              ttsd: true,
              ngay: true,
              ma_module: true,
            },
          },
          showIcon: false,
          commentCount: 0,
          displayOptions: {
            lang: {
              numericSymbols: ["K", "M", "B", "T", "P", "E"],
              thousandsSep: ",",
            },
            chart: {
              height: 503.7013816833496,
              width: 547,
              style: {
                fontFamily: "roboto",
              },
              type: "pie",
              backgroundColor: "rgba(255, 255, 255)",
            },
            title: {
              text: "",
            },
            xAxis: {
              labels: {
                autoRotation: [-45, -90],
              },
            },
            general: {
              textOutline: "0px",
              display: "",
              backgroundColor: "rgba(255, 255, 255)",
              color: "",
              fontFamily: "roboto",
              fontSize: "13px",
              textAlign: "",
              borderBottomWidth: "",
              borderWidth: "1px",
              borderColor: "rgba(216, 216, 216, 1)",
            },
            symperTitle: {
              text: "Số lượng bug theo status",
              style: {
                textOutline: "0px",
                display: "",
                backgroundColor: "rgba(255, 255, 255, 1)",
                color: "#344750",
                fontFamily: "roboto",
                fontSize: "14px",
                textAlign: "center",
                borderBottomWidth: "",
                borderWidth: "",
              },
            },
            plotOptions: {
              pie: {
                showInLegend: true,
                allowPointSelect: true,
                cursor: "pointer",
                dataLabels: {
                  backgroundColor: "#ffffff",
                  borderColor: "#000000",
                  borderWidth: 0,
                  borderRadius: 2,
                  enabled: true,
                  format: "<b>{point.name}</b>:<br>{point.percentage:.1f} %",
                  style: {
                    textOutline: "0px",
                    display: "",
                    backgroundColor: "#ffffff",
                    color: "#344750",
                    fontFamily: "roboto",
                    fontSize: "11",
                    textAlign: "",
                    borderBottomWidth: "",
                    borderWidth: "0",
                    borderColor: "#000000",
                    fontWeight: 300,
                  },
                },
              },
            },
            legend: {
              itemMarginBottom: 5,
              padding: 0,
              style: {
                textOutline: "0px",
                display: "",
                backgroundColor: "",
                color: "#344750",
                fontFamily: "roboto",
                fontSize: "12",
                textAlign: "",
                borderBottomWidth: "",
                borderWidth: "",
              },
              enabled: true,
              title: {
                text: "",
                style: {
                  fontSize: 13,
                  fontWeight: "400",
                },
              },
              itemStyle: {
                fontSize: 12,
                color: "#344750",
              },
              layout: "vertical",
              align: "left",
              verticalAlign: "top",
            },
            series: {
              name: "Số lượng",
              colorByPoint: true,
              data: [
                {
                  name: "APPROVED",
                  y: 19,
                  color: "rgba(37, 128, 57, 1)",
                },
                {
                  name: "FIXED",
                  y: 87,
                  color: "rgba(245, 190, 65, 1)",
                },
                {
                  name: "QA LEAD APPROVED",
                  y: 1,
                  color: "rgba(207, 55, 33, 1)",
                },
                {
                  name: "REVIEWING",
                  y: 18,
                  color: "rgba(49, 169, 184, 1)",
                },
                {
                  name: "RE-OPEN",
                  y: 4,
                  color: "rgba(191, 191, 191, 1)",
                },
                {
                  name: "TO DO",
                  y: 19,
                  color: "",
                },
                {
                  name: "NEW",
                  y: 144,
                  color: "",
                },
                {
                  name: "WIP",
                  y: 5,
                  color: "",
                },
                {
                  name: "TESTING",
                  y: 22,
                  color: "",
                },
              ],
            },
            tooltip: {},
            contentSize: {
              w: 548,
              h: 504.7013816833496,
            },
          },
          needSaveExtraOptions: {},
          filter: {},
          loadingData: false,
        },
      },
      testDataTreemap: {
        sharedConfigs: {
          type: "treeMap",
          yAxisCount: 1,
          cellId: "cell-1608886496317",
          data: [
            { "REPORT BỞI": "1077", "ISSUE ID": "2" },
            { "REPORT BỞI": "925", "ISSUE ID": "10" },
            { "REPORT BỞI": "972", "ISSUE ID": "7" },
            { "REPORT BỞI": "974", "ISSUE ID": "1" },
            { "REPORT BỞI": "979", "ISSUE ID": "2" },
          ],
          total: 0,
        },
        rawConfigs: {
          setting: {
            group: {
              name: "Group",
              slot: "n",
              selectedColums: [
                {
                  as: "REPORT BỞI",
                  agg: "not_agg",
                  cond: { val: "", type: "isall" },
                  edit: false,
                  name: "nguoi_report",
                  type: "text",
                  dataset: "3614",
                  origin_type: "text",
                },
              ],
            },
            value: {
              name: "Value",
              slot: "n",
              hasAgg: true,
              selectedColums: [
                {
                  as: "ISSUE ID",
                  agg: "count",
                  cond: { val: "", type: "isall" },
                  edit: false,
                  name: "id_bug",
                  type: "text",
                  dataset: "3614",
                  origin_type: "text",
                },
              ],
            },
            detail: { name: "Detail", slot: "1", selectedColums: [] },
            tooltips: {
              name: "Tooltips",
              slot: "n",
              hasAgg: true,
              selectedColums: [],
            },
          },
          style: [
            {
              label: "Legend",
              name: "legend",
              show: true,
              children: {
                show: {
                  label: "Show",
                  type: "switch",
                  default: true,
                  value: true,
                  name: "show",
                },
                name: {
                  label: "Name",
                  type: "text",
                  default: "",
                  value: "",
                  name: "name",
                },
                legendPosition: {
                  label: "Position",
                  type: "btnSelect",
                  default: "vertical-bottom",
                  options: [
                    {
                      name: "Left",
                      icon: "ms-Icon ms-Icon--AlignHorizontalLeft",
                      value: "vertical-left",
                      text: "",
                    },
                    {
                      name: "Top",
                      icon: "ms-Icon ms-Icon--AlignVerticalTop",
                      value: "horizontal-top",
                      text: "",
                    },
                    {
                      name: "Right",
                      icon: "ms-Icon ms-Icon--AlignHorizontalRight",
                      value: "vertical-right",
                      text: "",
                    },
                    {
                      name: "Bottom",
                      icon: "ms-Icon ms-Icon--AlignVerticalBottom",
                      value: "horizontal-bottom",
                      text: "",
                    },
                  ],
                  value: "horizontal-bottom",
                  name: "legendPosition",
                },
                fontColor: {
                  label: "Font Corlor",
                  type: "color",
                  default: "#344750",
                  value: "#344750",
                  name: "fontColor",
                },
                textSize: {
                  label: "Text Size",
                  type: "number",
                  default: "13",
                  value: 12,
                  name: "textSize",
                },
                showLegendTitle: {
                  label: "Show Legend Title",
                  type: "switch",
                  default: true,
                  value: false,
                  name: "showLegendTitle",
                },
                titleText: {
                  label: "Title text",
                  type: "text",
                  default: "",
                  value: "",
                  name: "titleText",
                },
              },
            },
            {
              label: "Group Data label",
              name: "lvl1DataLabel",
              show: true,
              children: {
                show: {
                  label: "Show",
                  type: "switch",
                  default: true,
                  value: true,
                  name: "show",
                },
                fontColor: {
                  label: "Font Corlor",
                  type: "color",
                  default: "#344750",
                  value: "rgba(255, 255, 255)",
                  name: "fontColor",
                },
                textSize: {
                  label: "Text Size",
                  type: "number",
                  default: "13",
                  value: 9,
                  name: "textSize",
                },
                bgColor: {
                  label: "Background Corlor",
                  type: "color",
                  default: "#ffffff",
                  value: "#ffffff",
                  name: "bgColor",
                },
                borderWidth: {
                  label: "Border Width",
                  type: "number",
                  default: 0,
                  value: 0,
                  name: "borderWidth",
                },
                borderColor: {
                  label: "Border Corlor",
                  type: "color",
                  default: "#000000",
                  value: "rgba(255, 255, 255)",
                  name: "borderColor",
                },
                alignment: {
                  label: "Alignment",
                  type: "btnSelect",
                  default: "left",
                  options: [
                    {
                      name: "left",
                      icon: "ms-Icon ms-Icon--AlignHorizontalLeft",
                      value: "left",
                      text: "",
                    },
                    {
                      name: "center",
                      icon: "ms-Icon ms-Icon--AlignHorizontalCenter",
                      value: "center",
                      text: "",
                    },
                    {
                      name: "right",
                      icon: "ms-Icon ms-Icon--AlignHorizontalRight",
                      value: "right",
                      text: "",
                    },
                  ],
                  value: "left",
                  name: "alignment",
                },
                verticalAlign: {
                  label: "vertical alignment",
                  type: "btnSelect",
                  default: "top",
                  options: [
                    {
                      name: "Top",
                      icon: "ms-Icon ms-Icon--AlignVerticalTop",
                      value: "top",
                      text: "",
                    },
                    {
                      name: "Midle",
                      icon: "ms-Icon ms-Icon--AlignVerticalCenter",
                      value: "midle",
                      text: "",
                    },
                    {
                      name: "bottom",
                      icon: "ms-Icon ms-Icon--AlignVerticalBottom",
                      value: "Bottom",
                      text: "",
                    },
                  ],
                  value: "top",
                  name: "verticalAlign",
                },
                tooltipDecimalNumber: {
                  label: "Decimal number",
                  type: "number",
                  default: 2,
                  value: 2,
                  name: "tooltipDecimalNumber",
                },
              },
            },
            {
              label: "Detail Data label",
              name: "lvl2DataLabel",
              show: true,
              children: {
                show: {
                  label: "Show",
                  type: "switch",
                  default: true,
                  value: false,
                  name: "show",
                },
                fontColor: {
                  label: "Font Corlor",
                  type: "color",
                  default: "#344750",
                  value: "#ffffff",
                  name: "fontColor",
                },
                textSize: {
                  label: "Text Size",
                  type: "number",
                  default: "13",
                  value: 8,
                  name: "textSize",
                },
                bgColor: {
                  label: "Background Corlor",
                  type: "color",
                  default: "#ffffff",
                  value: "#ffffff",
                  name: "bgColor",
                },
                borderWidth: {
                  label: "Border Width",
                  type: "number",
                  default: 0,
                  value: 0,
                  name: "borderWidth",
                },
                borderColor: {
                  label: "Border Corlor",
                  type: "color",
                  default: "#000000",
                  value: "#000000",
                  name: "borderColor",
                },
                alignment: {
                  label: "Alignment",
                  type: "btnSelect",
                  default: "left",
                  options: [
                    {
                      name: "left",
                      icon: "ms-Icon ms-Icon--AlignHorizontalLeft",
                      value: "left",
                      text: "",
                    },
                    {
                      name: "center",
                      icon: "ms-Icon ms-Icon--AlignHorizontalCenter",
                      value: "center",
                      text: "",
                    },
                    {
                      name: "right",
                      icon: "ms-Icon ms-Icon--AlignHorizontalRight",
                      value: "right",
                      text: "",
                    },
                  ],
                  value: "left",
                  name: "alignment",
                },
                verticalAlign: {
                  label: "vertical alignment",
                  type: "btnSelect",
                  default: "top",
                  options: [
                    {
                      name: "Top",
                      icon: "ms-Icon ms-Icon--AlignVerticalTop",
                      value: "top",
                      text: "",
                    },
                    {
                      name: "Midle",
                      icon: "ms-Icon ms-Icon--AlignVerticalCenter",
                      value: "midle",
                      text: "",
                    },
                    {
                      name: "bottom",
                      icon: "ms-Icon ms-Icon--AlignVerticalBottom",
                      value: "Bottom",
                      text: "",
                    },
                  ],
                  value: "top",
                  name: "verticalAlign",
                },
              },
            },
            {
              label: "General",
              name: "general",
              show: true,
              children: {
                fontFamily: {
                  label: "Font family",
                  type: "select",
                  default: "roboto",
                  options: [{ value: "roboto", text: "Roboto" }],
                  value: "roboto",
                  name: "fontFamily",
                },
                bgColor: {
                  label: "Background Corlor",
                  type: "color",
                  default: "#ffffff",
                  value: "rgba(255, 255, 255)",
                  name: "bgColor",
                },
                borderWidth: {
                  label: "Border Width",
                  type: "number",
                  default: 0,
                  value: "0",
                  name: "borderWidth",
                },
                borderColor: {
                  label: "Border Corlor",
                  type: "color",
                  default: "#000000",
                  value: "rgba(216, 216, 216, 1)",
                  name: "borderColor",
                },
                colorPalette: {
                  label: "Color palette",
                  type: "colorArray",
                  default: [],
                  value: [
                    "rgba(1, 184, 170, 1)",
                    "rgba(55, 70, 73, 1)",
                    "rgba(242, 200, 15, 1)",
                    "rgba(49, 169, 184, 1)",
                    "rgba(191, 191, 191, 1)",
                    "rgba(95, 107, 109, 1)",
                    "rgba(253, 98, 94, 1)",
                    "rgba(168, 208, 141, 1)",
                    "rgba(255, 0, 0, 0.73)",
                    "rgba(74, 88, 138, 1)",
                    "",
                    "",
                    "rgba(245, 190, 65, 1)",
                    "rgba(245, 190, 65, 1)",
                  ],
                  name: "colorPalette",
                },
              },
            },
            {
              label: "Title",
              name: "title",
              show: true,
              children: {
                show: {
                  label: "Show",
                  type: "switch",
                  default: true,
                  value: true,
                  name: "show",
                },
                titleText: {
                  label: "Title text",
                  type: "text",
                  default: "",
                  value: "Testing còn pending của QA",
                  name: "titleText",
                },
                fontColor: {
                  label: "Font Corlor",
                  type: "color",
                  default: "#344750",
                  value: "#344750",
                  name: "fontColor",
                },
                textSize: {
                  label: "Text Size",
                  type: "number",
                  default: "13",
                  value: 14,
                  name: "textSize",
                },
                alignment: {
                  label: "Alignment",
                  type: "btnSelect",
                  default: "left",
                  options: [
                    {
                      name: "left",
                      icon: "ms-Icon ms-Icon--AlignHorizontalLeft",
                      value: "left",
                      text: "",
                    },
                    {
                      name: "center",
                      icon: "ms-Icon ms-Icon--AlignHorizontalCenter",
                      value: "center",
                      text: "",
                    },
                    {
                      name: "right",
                      icon: "ms-Icon ms-Icon--AlignHorizontalRight",
                      value: "right",
                      text: "",
                    },
                  ],
                  value: "center",
                  name: "alignment",
                },
                bgColor: {
                  label: "Background Corlor",
                  type: "color",
                  default: "#ffffff",
                  value: "rgba(255, 255, 255, 1)",
                  name: "bgColor",
                },
              },
            },
          ],
          condition: [
            {
              as: "REPORT BỞI",
              agg: "first",
              cond: { val: "0", type: "isnot" },
              edit: false,
              name: "nguoi_report",
              type: "text",
              dataset: "3614",
              validValue: true,
              origin_type: "text",
            },
            {
              as: "REPORT BỞI",
              agg: "first",
              cond: { val: "", type: "notblank" },
              edit: false,
              name: "nguoi_report",
              type: "text",
              dataset: "3614",
              validValue: true,
              origin_type: "text",
            },
            {
              as: "TRẠNG THÁI",
              agg: "first",
              cond: { val: "TESTING", type: "is" },
              edit: false,
              name: "ttsd",
              type: "text",
              dataset: "3614",
              validValue: true,
              origin_type: "text",
            },
          ],
          extra: {},
        },
        viewConfigs: {
          isSelecting: false,
          selectedDataset: { 3614: { nguoi_report: true, id_bug: true } },
          showIcon: false,
          commentCount: 0,
          displayOptions: {
            lang: {
              numericSymbols: ["K", "M", "B", "T", "P", "E"],
              thousandsSep: ",",
            },
            chart: {
              height: 245.70141220092773,
              width: 549,
              style: { fontFamily: "roboto" },
              type: "treemap",
            },
            title: { text: "" },
            xAxis: { labels: { autoRotation: [-45, -90] } },
            tooltip: {},
            series: [
              {
                type: "treemap",
                layoutAlgorithm: "squarified",
                alternateStartingDirection: true,
                levels: [
                  {
                    level: 1,
                    layoutAlgorithm: "squarified",
                    dataLabels: {
                      enabled: true,
                      align: "left",
                      verticalAlign: "top",
                      style: {
                        textOutline: "0px",
                        display: "",
                        backgroundColor: "#ffffff",
                        color: "rgba(255, 255, 255)",
                        fontFamily: "roboto",
                        fontSize: "9",
                        textAlign: "left",
                        borderBottomWidth: "",
                        borderWidth: "0",
                        borderColor: "rgba(255, 255, 255)",
                        fontWeight: 100,
                      },
                    },
                  },
                  {
                    level: 2,
                    dataLabels: {
                      enabled: false,
                      align: "left",
                      verticalAlign: "top",
                      style: {
                        textOutline: "0px",
                        display: "none",
                        backgroundColor: "#ffffff",
                        color: "#ffffff",
                        fontFamily: "roboto",
                        fontSize: "8",
                        textAlign: "left",
                        borderBottomWidth: "",
                        borderWidth: "0",
                        borderColor: "#000000",
                        fontWeight: 100,
                      },
                    },
                  },
                ],
                data: [
                  { color: "rgba(1, 184, 170, 1)", name: "1077", value: 2 },
                  { color: "rgba(55, 70, 73, 1)", name: "925", value: 10 },
                  { color: "rgba(242, 200, 15, 1)", name: "972", value: 7 },
                  { color: "rgba(49, 169, 184, 1)", name: "974", value: 1 },
                  { color: "rgba(191, 191, 191, 1)", name: "979", value: 2 },
                ],
              },
            ],
            general: {
              textOutline: "0px",
              display: "",
              backgroundColor: "rgba(255, 255, 255)",
              color: "",
              fontFamily: "roboto",
              fontSize: "13px",
              textAlign: "",
              borderBottomWidth: "",
              borderWidth: "0px",
              borderColor: "rgba(216, 216, 216, 1)",
            },
            symperTitle: {
              text: "Testing còn pending của QA",
              style: {
                textOutline: "0px",
                display: "",
                backgroundColor: "rgba(255, 255, 255, 1)",
                color: "#344750",
                fontFamily: "roboto",
                fontSize: "14px",
                textAlign: "center",
                borderBottomWidth: "",
                borderWidth: "",
              },
            },
            contentSize: { w: 550, h: 246.70141220092773 },
          },
          needSaveExtraOptions: {},
          filter: {},
          loadingData: false,
        },
      },
    };
  },
  computed: {
    currentCellConfigs() {
      return this.$store.state.dashboard.allDashboard[this.instanceKey]
        .currentCellConfigs;
    },
  },
};
</script>
<style scoped>
</style>