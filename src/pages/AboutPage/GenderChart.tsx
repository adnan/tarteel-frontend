import React from 'react';
import Chart from 'chart.js/dist/Chart.bundle.min';

interface IProps {
  genderLabels: any;
  genderData: any;
}

class GenderChart extends React.Component<IProps, {}> {
  private genderChartRef = React.createRef<HTMLCanvasElement>();
  configureGenderChart = () => {
    const { genderData, genderLabels } = this.props;
    if (!genderData || !genderLabels) {
      return null;
    }

    // Chart for gender doughnut (D'oh)
    const genderCTX = this.genderChartRef.current!.getContext('2d');
    const backgroundColor = ['#8e5ea2', '#3e95cd'];
    const genderChart = new Chart(genderCTX, {
      // The type of chart we want to create
      type: 'doughnut',

      // The data for our dataset
      data: {
        labels: this.props.genderLabels,
        datasets: [
          {
            label: 'Reported Gender',
            backgroundColor,
            data: this.props.genderData,
          },
        ],
      },

      // Configuration options go here
      options: {
        title: {
          display: true,
          text: 'Reported Gender',
        },
      },
    });
  };

  componentDidMount() {
    this.configureGenderChart();
  }

  componentDidUpdate(prevProps: IProps) {
    if (
      this.props.genderData &&
      this.props.genderLabels &&
      !prevProps.genderData &&
      !prevProps.genderLabels
    ) {
      this.configureGenderChart();
    }
  }

  render() {
    return (
      <div className="canvas-container" id="age-canvas">
        <canvas ref={this.genderChartRef} />
      </div>
    );
  }
}

export default GenderChart;
