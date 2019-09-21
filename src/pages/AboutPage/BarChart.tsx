import React from 'react';
import Chart from 'chart.js/dist/Chart.bundle.min';

interface IProps {
  labels: [string];
  data: [number];
  text: string;
  labelString: string;
}

class BarChart extends React.Component<IProps, {}> {
  private barChartRef = React.createRef<HTMLCanvasElement>();
  configureBarChart = () => {
    const { labels, data, text, labelString } = this.props;
    if (!labelString || !text || !data || !labels) {
      return null;
    }

    const backgroundColors6 = [
      '#3e95cd',
      '#8e5ea2',
      '#3cba9f',
      '#e8c3b9',
      '#c45850',
      '#8888aa',
    ];

    const barCtx = this.barChartRef.current!.getContext('2d');
    const barChart = new Chart(barCtx, {
      // The type of chart we want to create
      type: 'bar',
      // The data for our dataset
      data: {
        labels,
        datasets: [
          {
            backgroundColor: backgroundColors6,
            data,
          },
        ],
      },

      // Configuration options go here
      options: {
        legend: {
          display: false,
        },
        title: {
          display: true,
          text,
        },
        scales: {
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString,
              },
            },
          ],
        },
      },
    });
  };

  componentDidMount() {
    this.configureBarChart();
  }

  componentDidUpdate(prevProps: IProps) {
    if (
      (this.props.data && !prevProps.data) ||
      (this.props.labels && !prevProps.labels)
    ) {
      this.configureBarChart();
    }
  }
  render() {
    return (
      <div className="canvas-container">
        <canvas ref={this.barChartRef} />
      </div>
    );
  }
}

export default BarChart;
