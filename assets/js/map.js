/* 客户分布互动地图 · ECharts 5.x + 中国地图 GeoJSON
   在线时读取 assets/vendor/china-geo.json，本地双击打开时使用页面内嵌的地图数据。 */

(function () {
  "use strict";

  var COLORS = {
    klein: "#012696",
    orange: "#F15A22",
    gray: "#9AA0A6",
    province: "#F0F4F8",
    border: "#D0D8E0",
    emphasis: "#E3EAF6",
    platinum: "#E5E4E2"
  };

  /* 项目清单里的工厂名称与城市名的对应关系（用于统计每座城市的交付台数） */
  var ALIASES = {
    巴彦淖尔: ["巴盟"],
    乌鲁木齐: ["新疆"],
    呼和浩特: ["和林"],
  };

  var chart = null;
  var geoPromise = null;

  function embeddedGeo() {
    var node = document.getElementById("geo-data");
    if (!node) return null;
    try {
      return JSON.parse(node.textContent);
    } catch (err) {
      return null;
    }
  }

  function loadGeo() {
    if (geoPromise) return geoPromise;
    geoPromise = fetch("assets/vendor/china-geo.json", { cache: "force-cache" })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .catch(function () {
        var inline = embeddedGeo();
        if (inline) return inline;
        throw new Error("无法读取地图数据");
      });
    return geoPromise;
  }

  function deliveredByCity(data) {
    var rows = ((data.projects || {}).rows) || [];
    var totals = {};
    rows.forEach(function (row) {
      var names = [row.customer];
      Object.keys(ALIASES).forEach(function (city) {
        if (row.customer.indexOf(city) >= 0) names.push(city);
        ALIASES[city].forEach(function (alias) {
          if (row.customer.indexOf(alias) >= 0) names.push(city);
        });
      });
      (data.cities || []).forEach(function (city) {
        names.forEach(function (n) {
          if (n && n.indexOf(city.name) >= 0) {
            totals[city.name] = (totals[city.name] || 0) + (Number(row.qty) || 0);
          }
        });
      });
    });
    return totals;
  }

  function colorFor(city) {
    var brands = city.brands || [];
    var meng = brands.indexOf("蒙牛") >= 0;
    var yi = brands.indexOf("伊利") >= 0;
    if (meng && yi) return { color: COLORS.klein, border: COLORS.orange, width: 1.6 };
    if (meng) return { color: COLORS.klein, border: "rgba(255,255,255,0.9)", width: 1 };
    if (yi) return { color: COLORS.orange, border: "rgba(255,255,255,0.9)", width: 1 };
    if (city.isHQ) return { color: COLORS.klein, border: COLORS.orange, width: 2 };
    return { color: COLORS.gray, border: "rgba(255,255,255,0.9)", width: 1 };
  }

  function init(data) {
    var container = document.getElementById("china-map");
    if (!container) return;
    if (!window.echarts) {
      container.innerHTML =
        '<p style="padding:40px;text-align:center;color:#808080">地图组件未加载，请刷新页面重试。</p>';
      return;
    }

    var totals = deliveredByCity(data);
    var points = (data.cities || []).map(function (city) {
      var qty = totals[city.name] || 0;
      var style = colorFor(city);
      return {
        name: city.name,
        value: [city.lon, city.lat, qty],
        brands: city.brands || [],
        qty: qty,
        isHQ: !!city.isHQ,
        symbolSize: qty ? Math.min(26, 8 + Math.sqrt(qty) * 3.4) : 7,
        itemStyle: {
          color: style.color,
          borderColor: style.border,
          borderWidth: style.width,
          shadowBlur: 10,
          shadowColor: "rgba(1,18,63,0.25)"
        }
      };
    });

    function render(geo) {
      window.echarts.registerMap("china", geo);
      chart = window.echarts.init(container, null, { renderer: "canvas" });
      chart.setOption({
        backgroundColor: "transparent",
        tooltip: {
          trigger: "item",
          backgroundColor: "rgba(20,21,26,0.92)",
          borderWidth: 0,
          padding: [10, 14],
          textStyle: { color: "#fff", fontSize: 13 },
          formatter: function (params) {
            if (params.seriesType === "map") {
              return params.name;
            }
            var d = params.data || {};
            var lines = ["<strong>" + params.name + "</strong>"];
            if (d.brands && d.brands.length) {
              lines.push("合作品牌：" + d.brands.join("、"));
            } else {
              lines.push("合作品牌：以公司资料为准");
            }
            if (d.qty) lines.push("清单交付：" + d.qty + " 台");
            if (d.isHQ) lines.push("公司总部所在地");
            return lines.join("<br>");
          }
        },
        geo: {
          map: "china",
          roam: true,
          layoutCenter: ["50%", "50%"],
          layoutSize: "104%",
          scaleLimit: { min: 0.9, max: 5 },
          itemStyle: {
            areaColor: COLORS.province,
            borderColor: COLORS.border,
            borderWidth: 1
          },
          emphasis: {
            itemStyle: { areaColor: COLORS.emphasis, borderColor: COLORS.klein },
            label: { show: false }
          },
          select: { itemStyle: { areaColor: COLORS.emphasis }, label: { show: false } }
        },
        series: [
          {
            name: "客户城市",
            type: "scatter",
            coordinateSystem: "geo",
            data: points,
            symbol: "circle",
            emphasis: { scale: 1.35, itemStyle: { shadowBlur: 16, shadowColor: "rgba(1,38,150,0.45)" } },
            label: {
              show: true,
              formatter: function (params) {
                return params.data.qty ? params.name : "";
              },
              position: "right",
              color: "#3C3D44",
              fontSize: 11,
              distance: 6
            },
            zlevel: 2,
            animationDuration: 700,
            animationEasing: "cubicOut"
          }
        ]
      });

      var resize = function () {
        if (chart) chart.resize();
      };
      window.addEventListener("resize", resize);
      if (window.ResizeObserver) {
        new ResizeObserver(resize).observe(container);
      }
    }

    loadGeo().then(render).catch(function (err) {
      container.innerHTML =
        '<p style="padding:40px;text-align:center;color:#808080">地图数据加载失败：' +
        err.message +
        "</p>";
    });
  }

  window.WochangMap = { init: init };
})();
