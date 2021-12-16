/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import React, {
  useRef,
  useEffect,
  useMemo,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { styled } from '@superset-ui/core';
import { ECharts, init, registerLocale } from 'echarts';
import { EchartsHandler, EchartsProps, EchartsStylesProps } from '../types';

const Styles = styled.div<EchartsStylesProps>`
  height: ${({ height }) => height};
  width: ${({ width }) => width};
`;

const localeObj = {
  time: {
    month: [
      '1 сар',
      '2 сар',
      '3 сар',
      '4 сар',
      '5 сар',
      '6 сар',
      '7 сар',
      '8 сар',
      '9 сар',
      '10 сар',
      '11 сар',
      '12 сар',
    ],
    monthAbbr: [
      '1 сар',
      '2 сар',
      '3 сар',
      '4 сар',
      '5 сар',
      '6 сар',
      '7 сар',
      '8 сар',
      '9 сар',
      '10 сар',
      '11 сар',
      '12 сар',
    ],
    dayOfWeek: ['Ням', 'Даваа', 'Мягмар', 'Лхагва', 'Пүрэв', 'Баасан', 'Бямба'],
    dayOfWeekAbbr: [
      'Ням',
      'Даваа',
      'Мягмар',
      'Лхагва',
      'Пүрэв',
      'Баасан',
      'Бямба',
    ],
  },
  legend: {
    selector: {
      all: 'All',
      inverse: 'Inv',
    },
  },
  toolbox: {
    brush: {
      title: {
        rect: 'Box Select',
        polygon: 'Lasso Select',
        lineX: 'Хэвтээгээр сонгох',
        lineY: 'Босоогоор сонгох',
        keep: 'Сонголтыг хадгалах',
        clear: 'Арилгах',
      },
    },
    dataView: {
      title: 'Өгөгдөл харах',
      lang: ['Өгөгдөл харах', 'Хаах', 'Сэргээх'],
    },
    dataZoom: {
      title: {
        zoom: 'Томруулах',
        back: 'Дахин томруулах',
      },
    },
    magicType: {
      title: {
        line: 'Шугаман диаграм руу шилжих',
        bar: 'Бар диаграм руу шилжих',
        stack: 'Стак',
        tiled: 'Тайл',
      },
    },
    restore: {
      title: 'Сэргээх',
    },
    saveAsImage: {
      title: 'Зураг болгон хадгалах',
      lang: ['Зургийг хадгалахын тулд баруун товчийг дарна уу'],
    },
  },
  series: {
    typeNames: {
      pie: 'Pie chart',
      bar: 'Bar chart',
      line: 'Line chart',
      scatter: 'Scatter plot',
      effectScatter: 'Ripple scatter plot',
      radar: 'Radar chart',
      tree: 'Tree',
      treemap: 'Treemap',
      boxplot: 'Boxplot',
      candlestick: 'Candlestick',
      k: 'K line chart',
      heatmap: 'Heat map',
      map: 'Map',
      parallel: 'Parallel coordinate map',
      lines: 'Line graph',
      graph: 'Relationship graph',
      sankey: 'Sankey diagram',
      funnel: 'Funnel chart',
      gauge: 'Gauge',
      pictorialBar: 'Pictorial bar',
      themeRiver: 'Theme River Map',
      sunburst: 'Sunburst',
    },
  },
  aria: {
    general: {
      withTitle: 'Графикийн талаар "{title}"',
      withoutTitle: 'График',
      // withoutTitle: 'This is a chart'
    },
    series: {
      single: {
        prefix: '',
        withName: '{seriesName} нэртэй, {seriesType} төрөлтэй.',
        withoutName: ' {seriesType} төрлийн.',
      },
      multiple: {
        prefix: '. Энэ нь {seriesCount} цувралын тооноос бүрдэнэ.',
        withName:
          ' The {seriesId} series is a {seriesType} representing {seriesName}.',
        withoutName: ' {seriesId} цуврал нь {seriesType}.',
        separator: {
          middle: '',
          end: '',
        },
      },
    },
    data: {
      allData: 'Өгөгдөл нь дараах байдалтай байна: ',
      partialData: 'Эхний {displayCnt} нь: ',
      // partialData: 'The first {displayCnt} items are: ',
      withName: 'Өгөгдлийн {name}-д бол {value}',
      // withName: 'the data for {name} is {value}',
      withoutName: '{value}',
      separator: {
        middle: ', ',
        end: '. ',
      },
    },
  },
};

registerLocale('MN', localeObj);

function Echart(
  {
    width,
    height,
    echartOptions,
    eventHandlers,
    zrEventHandlers,
    selectedValues = {},
  }: EchartsProps,
  ref: React.Ref<EchartsHandler>,
) {
  const divRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<ECharts>();
  const currentSelection = useMemo(
    () => Object.keys(selectedValues) || [],
    [selectedValues],
  );
  const previousSelection = useRef<string[]>([]);

  useImperativeHandle(ref, () => ({
    getEchartInstance: () => chartRef.current,
  }));

  useEffect(() => {
    if (!divRef.current) return;
    if (!chartRef.current) {
      chartRef.current = init(divRef.current, undefined, {
        locale: 'MN',
      });
    }

    Object.entries(eventHandlers || {}).forEach(([name, handler]) => {
      chartRef.current?.off(name);
      chartRef.current?.on(name, handler);
    });

    Object.entries(zrEventHandlers || {}).forEach(([name, handler]) => {
      chartRef.current?.getZr().off(name);
      chartRef.current?.getZr().on(name, handler);
    });

    chartRef.current.setOption(echartOptions, true);
  }, [echartOptions, eventHandlers, zrEventHandlers]);

  // highlighting
  useEffect(() => {
    if (!chartRef.current) return;
    chartRef.current.dispatchAction({
      type: 'downplay',
      dataIndex: previousSelection.current.filter(
        value => !currentSelection.includes(value),
      ),
    });
    if (currentSelection.length) {
      chartRef.current.dispatchAction({
        type: 'highlight',
        dataIndex: currentSelection,
      });
    }
    previousSelection.current = currentSelection;
  }, [currentSelection]);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.resize({ width, height });
    }
  }, [width, height]);

  return <Styles ref={divRef} height={height} width={width} />;
}

export default forwardRef(Echart);
