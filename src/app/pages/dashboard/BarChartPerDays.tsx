import React, {useEffect, useRef, useState} from 'react'
import {useThemeMode} from '../../../_metronic/partials'
import ApexCharts, {ApexOptions} from 'apexcharts'
import {getCSSVariableValue} from '../../../_metronic/assets/ts/_utils'

type Props = {
  className: string
  chartColor: string
  chartHeight: string
  barcolor: string
}

const BarChartPerDays: React.FC<Props> = ({className, chartColor, chartHeight, barcolor}) => {
  const chartRef = useRef<HTMLDivElement | null>(null)
  const {mode} = useThemeMode()
  const refreshChart = () => {
    if (!chartRef.current) {
      return
    }
    let color = barcolor
    const chart = new ApexCharts(chartRef.current, chartOptions(chartColor, chartHeight, color))
    if (chart) {
      chart.render()
    }

    return chart
  }

  useEffect(() => {
    const chart = refreshChart()

    return () => {
      if (chart) {
        chart.destroy()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartRef, mode])

  return (
    <div className={`card ${className}`}>
      {/* begin::Body */}
      <div className='card-body p-0 d-flex justify-content-between flex-column overflow-hidden'>
        <div ref={chartRef} className='mixed-widget-10-chart'></div>
        {/* end::Chart */}
      </div>
    </div>
  )
}
const days: string[] = []
// let newMonthNames: string[]=[]

// var currentDate = new Date()
// console.log('Original date: ', currentDate.toString())

// for (let index = 1; index <= 11; index++) {
//   currentDate.setMonth(currentDate.getDay()- index)
//   console.log('After subtracting a month: ', monthNames[currentDate.getMonth()])
//   newMonthNames.push(monthNames[currentDate.getMonth()])
//   currentDate = new Date()
// }
const getPreviousDay = (date: Date, index: any) => {
  const previous = new Date(date.getTime())
  previous.setDate(date.getDate() - index)

  return previous
}
for (let index = 1; index <= 30; index++) {
  days.push(getPreviousDay(new Date(), index).toISOString().split('T')[0].split('-')[2])
  console.log(getPreviousDay(new Date(), index).toISOString().split('T')[0].split('-')[2])
}

const chartOptions = (chartColor: string, chartHeight: string, color: string): ApexOptions => {
  const labelColor = getCSSVariableValue('--kt-gray-500')
  const borderColor = getCSSVariableValue('--kt-gray-200')
  const secondaryColor = getCSSVariableValue('--kt-gray-300')
  const baseColor = color

  return {
    series: [
      {
        name: 'Total',
        data: [
          50, 60, 70, 80, 60, 50, 70, 60, 50, 24, 43, 34, 50, 60, 70, 80, 60, 50, 70, 60, 50, 24,
          43, 34, 70, 60, 50, 24, 43, 34,
        ],
      },
    ],
    chart: {
      fontFamily: 'inherit',
      type: 'bar',
      height: chartHeight,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '50%',
        borderRadius: 5,
      },
    },
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: days,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: labelColor,
          fontSize: '12px',
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: labelColor,
          fontSize: '12px',
        },
      },
    },
    fill: {
      type: 'solid',
    },
    states: {
      normal: {
        filter: {
          type: 'none',
          value: 0,
        },
      },
      hover: {
        filter: {
          type: 'none',
          value: 0,
        },
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: 'none',
          value: 0,
        },
      },
    },
    tooltip: {
      style: {
        fontSize: '12px',
      },
      y: {
        formatter: function (val) {
          return `${val} Hours`
        },
      },
    },
    colors: [baseColor, secondaryColor],
    grid: {
      padding: {
        top: 10,
      },
      borderColor: borderColor,
      strokeDashArray: 4,
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
  }
}

export {BarChartPerDays}
