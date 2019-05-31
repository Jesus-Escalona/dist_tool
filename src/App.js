import React, {Component} from 'react';
import Plot from 'react-plotly.js';
import Person from './components/Person'
import Table from './components/Table'

import './App.css';

class App extends Component {

    state = {
        numberOfPeople: 0,
        people: [],
        sortedPeople: [],
        tables: [],
        label: ["A1", "A2", "B1", "B2", "C1", "C2"],
        link: {
            source: [0,1,0,2,3,3],
            target: [2,3,3,4,4,5],
            value:  [8,4,2,8,4,2]
        }
    };

    getNumberOfTables = (seatsPerTable = 8) => {
        const { numberOfPeople } = this.state;
        let numberOfTables = Math.ceil(numberOfPeople / seatsPerTable);
        let remaining = numberOfTables * seatsPerTable - numberOfPeople;

        while (remaining >= seatsPerTable / 2 && seatsPerTable >= 6) {
            seatsPerTable -= 1;
            numberOfTables = Math.ceil(numberOfPeople / seatsPerTable);
            remaining = numberOfTables * seatsPerTable - numberOfPeople
        }

        return numberOfTables
    };

    sortPeople = (people) => {
        return people.sort((a,b) => a.gender - b.gender || a.act - b.act || a.sector - b.sector)
    };

    assignTables = () => {
        const { sortedPeople } = this.state;
        let people = [...sortedPeople];
        let numberOfTables = this.getNumberOfTables();
        let tables = Array(numberOfTables).fill(0).map(() => new Table());
        let i = 0;
        while (people.length) {
            let tableIdx = i % numberOfTables;
            tables[tableIdx].addPerson(people.pop());
            i++
        }

        return tables
    };

    generatePeople = () => {
        const { numberOfPeople } = this.state;
        let people = Array(parseInt(numberOfPeople)).fill(0).map(() => new Person(Math.floor(Math.random() * 10), Math.floor(Math.random() * 10), Math.floor(Math.random() * 2)));
        let sortedPeople = this.sortPeople([...people]);
        this.setState({people, sortedPeople});
    };



    render() {
        const { numberOfPeople, label, link } = this.state;
        return (
            <div className="App">
                <h1>Seating Tool Visualization</h1>
                <input value={numberOfPeople || ""} onChange={(e) => this.setState({numberOfPeople: e.target.value})} placeholder="Enter a number"/>
                <button onClick={this.generatePeople}>Assign tables</button>

                <Plot
                    data={[
                        {
                            type: "sankey",
                            orientation: "h",
                            node: {
                                pad: 40,
                                thickness: 40,
                                label,
                                colorscale: "Picnic"
                            },

                            link
                        }
                    ]}
                    layout={ {width: 800, height: 600, title: 'A Fancy Sankey', font: {size: 10}} }
                />
            </div>
        )
    }
}

export default App;
