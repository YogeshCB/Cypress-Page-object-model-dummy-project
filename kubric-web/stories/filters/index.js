import { h, Component } from 'preact';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Filters from '../../browser/js/components/Filters';
import FilterSelect from '../../browser/js/components/commons/FilterSelect';

const filters = [{
  "name": "Location",
  "children": [{
    "name": "Bangalore",
    "children": [{
      image: "http://lh3.googleusercontent.com/Pmd75uQ3Dhf0XKI_I5lg5O3tc-Nui5Y2tU6mcvGwcOzVwiAJ_I2YXYe2RwBv-7Ln5CO78pb7GhOtTida74OtO2BXVg=s200-c"
    }, {
      image: "http://lh3.googleusercontent.com/P8l4UgWRzxF8YhzsabKEm34jTpwwQ_pQNM2FRkYvWDJubSJePn0qrXalmESo9HI4orpuobnYy8vEQi60kkc7azemOg=s200-c"
    }, {
      image: "http://lh3.googleusercontent.com/MPpZQFs7iIVK7LOj7pXEwBldPyJDfbCvF9Q-cp-ZOzkUGSCct-ug0KzCaPRDum_Q2PXr9s1Kyc3qoPzJKMvjT6tk=s200-c"
    }, {
      image: "http://lh3.googleusercontent.com/sY29VsDX3fG9Nbiq2tt1FT8n5FJPDnxCtZa097cGBxRpvTHe5S18bPg6zYGg6MTyXFBW3S5-2y8uTsI_YoTdKXCk=s200-c"
    }]
  }, {
    "name": "Kochi",
    "children": [{
      image: "http://lh3.googleusercontent.com/GdSG6gZ4py3LN6VCIBLmwMdZj_A8BQXAn9il6a4QbR7U2c_f_FspiJMwX0DThuldw_pQNapWDnetvydn4geeqzbK3N0=s200-c"
    }, {
      image: "http://lh3.googleusercontent.com/njdBOnYzJLORB_-rJbRjFjujauPt3UeRGsCvEIAPGijpK0sjWOxAvgssk6F357EtxD3OPoV3EPiZA2Jmcep0hxvrQD0=s200-c"
    }, {
      image: "http://lh3.googleusercontent.com/JZ0zIkUXvPHmJv5EKU892vCEi7oGp2d3cTpimZLg9lJ2O3GiFfadFO5wYmt5xlNZPDyNu56fvsb2OoXaziDtm4dqtQ=s200-c"
    }, {
      image: "http://lh3.googleusercontent.com/5slIQsR7fhgCgQEu_MzfsrHC9EcXtGSRH_ZSyDudtmE0zLcEm51J0GmJHqSqWhfVyzlhZPpXR_M2aXn7x9FBjH2NXA=s200-c"
    }]
  }],
  "count": 8
}, {
  "name": "Occasion",
  "children": [{
    "name": "Rains",
    selected: true,
    "children": [{
      selected: true,
      image: "http://lh3.googleusercontent.com/Tl249PQa_CUCabxbIEa4ljpYiUT20ni1OsPyoiv3d6CguZ2BquU68Cc2jUj7j9WDkw1bNu1HCnV6mm38hu5CM7DLSw=s200-c"
    }, {
      image: "http://lh3.googleusercontent.com/wcE5RauXgcwfcVdCpm_oAoa6YQJ_eAQHoAgm-oBM4wnqwUracZMTZZgMfUkG3hUAyG03N6ZTElGTYqogLH808GGg2-0=s200-c"
    }, {
      image: "http://lh3.googleusercontent.com/eM-U6xYdTtoEzjcAYEX9RKu8H4FWecMZxQQZyIvgQ9F7rpgcx7DKOy8T_D3nP8or-qMTZMUJg89G6crOU2LSxlsNlQ=s200-c"
    }, {
      image: "http://lh3.googleusercontent.com/86nGLxhQSWYVy34HegfhDXEUkkKuXhF0DiuDyO9ShBhBLQEP8izhntNJVlmcOx_smWL7LC3WO2nAgJmFH_pf2y9Mxw=s200-c"
    }, {
      image: "http://lh3.googleusercontent.com/32qc3--qAnw6LvgTla8vkpReqYlMVPwspuYTd2res6DH0Pan6cB-sWa4aSl0TSqEuHsuzC86q2SQM_us3dOp9LU3AA=s200-c"
    }]
  }, {
    "name": "Pollution",
    "children": [{
      image: "http://lh3.googleusercontent.com/M5zYS4RisuHZCnBuc4adke4BU3r3imkFpD5Ne-7MSkhM2wJx5ex3uIkqSkKs1T_nCrLdzf_QyjG0nFax3cez88wjzQ=s200-c"
    }, {
      image: "http://lh3.googleusercontent.com/3ePw1hnO_O7MqqhbG6W0c1XyY09CzWnT0yBdJR4JofYAmb3eFQ7rcHy4-ea9el0jpEmOE2qZB9fm_EE-QCfH1s4J5A=s200-c"
    }, {
      image: "http://lh3.googleusercontent.com/zR-8NqOtSdP52XyI5eGva8A1J0uyWERhN2qd80rcKsSiQ_cybXqVwIm614H-2HW-H1xUbv2aC09OP5vuNZfJ1PnBLw=s200-c"
    }, {
      image: "http://lh3.googleusercontent.com/swx734fV34D0A_znkGYhJlvOvitTc_SNbJIkuEPn4qI7cf6nLrzHxsZYD1IutcdJxBqvX_tdp7qIDH73OP_U8pf0RA=s200-c"
    }, {
      image: "http://lh3.googleusercontent.com/S3j2IRzZzU8MMekGBvs8c2eTFcsrXPRIcnJ77POufl5sLqd2ErFmMHWqAwQ8Y9xpwX76gGsIj8dam2gGQDxsITrejg=s200-c"
    }]
  }],
  "count": 10
}, {
  "name": "Product",
  "children": [{
    "name": "Headphones",
    "children": [{
      image: "http://lh3.googleusercontent.com/RctDu-IsvssLdX94g7bK9ETbtIjw27ArQh52ntaW_5bILtzlkO461zGrOjAUds5UoYlXQe9iOQnUO6TBFyp9Nq56MQ=s200-c"
    }, {
      image: "http://lh3.googleusercontent.com/AVtlLEJlmFCHreyarQv_euGHtjBzpgruFYCbG38pFBHsInvC-n5vOJ0iLSY1_st-iuRZFdgScgKdg2UXjvSh9z7m=s200-c"
    }, {
      image: "http://lh3.googleusercontent.com/44iKJr6rKzjsCbGRYuLiAxomoZZHbvT7KbY4Vl4f__55PJZb4mvKdJ2tL_Ea3b6p20bUEKtmYJsqG1FonRC1YUOrItk=s200-c"
    }]
  }, {
    "name": "Gramaphones",
    "children": [{
      image: "http://lh3.googleusercontent.com/NG9lOvfGBqrsNhFYS-bJscrJ-8P7saZ7E-c8foRiExu6XDdBX4YIWAgMJ--Spmr7XSvxIgS0F--i8WWXhKAZrkDm5A=s200-c"
    }, {
      image: "http://lh3.googleusercontent.com/X5vGi_0_fDs-7buaYBdu_kpS432eAKpMIflOktBfMpzrY9xSExadPel67oAEVkh5QF6KZ__2aGRMlWWgSiy4lgEeeg=s200-c"
    }, {
      image: "http://lh3.googleusercontent.com/KDqKrcHYcAgNstYttlllZlu62dkgqOvM5ugqOtcZfMLXpxE0KUqNssFuvgj4oYNmgeWOSHVyBAakVOb8GwwL-miw5g=s200-c"
    }, {
      image: "http://lh3.googleusercontent.com/LmWuYS9vPuetegjsdUsqqPZ4y08WMZuRXbZS7mR0FSRNHoisK2aiNq02BwSsdyznvTLyHFaJgOpSF8AfZZJNE2xn0Q=s200-c"
    }, {
      image: "http://lh3.googleusercontent.com/ive_BY3JtnFc1gbVi4QgGF6qL8t2iv2qVBpDwVXsg2kxt4TcBR-RDtG21h5pT2Z_9fXpqYS1F06FndNvrDxBzinlLOo=s200-c"
    }, {
      image: "http://lh3.googleusercontent.com/DbKgV53RvSteumqsMiJ9WjexQljnOX7RBHaLusp71LKYWWLmr8FmvU6MsDN-54gsdBLa16fi547v3qJ8cQZ4TCH6-A=s200-c"
    }, {
      image: "http://lh3.googleusercontent.com/fiVLQyXtcBGgAFDBtsczZKToRvGCKWLPHlf2z0ToVDAxdYF_h6U3vG8lcR_H-yiv39AgPbbWBuOi6XF33_rBYGwuig=s200-c"
    }]
  }],
  "count": 10
}];

class Test extends Component {
  state = {
    selected: ['0.0.0'],
  };

  onSelected(index) {
    console.log('selected', index);
    this.setState({
      selected: [...this.state.selected, index],
    });
  }

  onUnselected(index) {
    console.log('unselected', index);
    this.setState({
      selected: this.state.selected.filter(selection => selection !== index),
    });
  }

  render() {
    const { selected } = this.state;
    return <Filters filters={filters} selected={selected} onUnselected={::this.onUnselected}
                    onSelected={::this.onSelected}/>
  }
}

class TestSelect extends Component {
    state = {
        filter: 'name',
        value: '', 
        debounce: 500,
        filterConfig: [{
            label: 'Status',
            field: 'status',
            style: 'buttons',
            data: '',
            value: 'searchbox',
            values: [{
                name: 'In Generation',
                value: 'generation-inprogress',
            }, {
                name: 'In Generation',
                value: 'generation-inprogress',
            }, {
                name: 'In Generation',
                value: 'generation-inprogress',
            }]
        }, {
            label: 'Name',
            field: 'name',
            value: 'text',
            data:''
        }]
    }
    filterChange = (value) => {
        console.log(value);
        this.setState({
            value: value
        })
    }
    onSelected = (value, name, data, label) => {
        console.log(value, label);
        this.setState({
            filter: value
        })
    }
    filterFunction = (value) => {
        console.log(value)
    }
    render() {
        const { filterConfig, filter, value, debounce } = this.state

        return (
            <div>
                <FilterSelect 
                    filterConfig={filterConfig} 
                    filterChange={this.filterChange} 
                    filter={filter}
                    value={value} 
                    debounce={debounce}
                    filterFunction={this.filterFunction}
                    onSelected={this.onSelected}
                 />
            </div>
        );
    }
}


storiesOf('Filters', module)
  .add('Default', () => (
    <Test/>
  ))
  .add('with SelectBox', () => (
      <TestSelect />
  ));