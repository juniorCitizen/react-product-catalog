import React from 'react'

export default class Series extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      list: [],
    }
  }

  componentDidMount() {
    let list = this.resetData(data)
    this.setState({ list: list })

  }

  resetData(data) {
    let arr = []
    data.map((item) => {
      item.tco = item.length
      arr.push(item)
      if (item.childSeries !== []) {
        item.childSeries.map((sitem) => {
          sitem.tco = item.childSeries.length
          arr.push(sitem)
        })
      }
    })
    return arr
  }

  searchSeries(parId, disSeq) {
    let { list } = this.state
    let id = null
    list.map((item) => {
      let main = this.getSeriesId(item, parId, disSeq)
      if (main !== null) {
        id = main
      } else {
        item.childSeries.map((subitem) => {
          let sub = this.getSeriesId(subitem, parId, disSeq)
          if (sub !== null) {
            id = sub
          }
        })
      }
    })
    return id
  }

  getSeriesId(item, parId, disSeq) {
    let id = null
    if (item.parentSeriesId === parId) {
      if (item.displaySequence === disSeq) {
        id = item.id
      }
    }
    return id
  }

  onAdd(item) {

  }

  onLeft(item) {
    let id = this.searchSeries(item.parentSeriesId, item.displaySequence)
  }

  onUp(item) {

  }

  onRight(item) {

  }

  onDown(item) {

  }

  onDelete(item) {

  }

  render() {
    const { list } = this.state
    return (
      <div>
        <div className="container" style={style.container}>
          <table className="table is-bordered is-hoverable is-narrow is-fullwidth">
            <thead>
              <tr>
                <th>分類名稱</th>
                <th width="269">
                  <button className="button" style={style.tableButton} >
                    <span className="icon has-text-info">
                      <i className="fa fa-plus fa-lg"></i>
                    </span>
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {list.map((item, index) => (
                <tr key={index}>
                  <td>{item.menuLevel ? '----' + item.name : '' + item.name}</td>
                  <td>
                    <button className="button" disabled={item.menuLevel === 1} style={style.tableButton} >
                      <span className="icon has-text-info">
                        <i className="fa fa-plus fa-lg"></i>
                      </span>
                    </button>
                    <button className="button" disabled={item.menuLevel === 0} style={style.tableButton} onClick={this.onLeft.bind(this, item)}>
                      <span className="icon">
                        <i className="fa fa-arrow-left fa-lg"></i>
                      </span>
                    </button>
                    <button className="button" disabled={item.displaySequence === 0} style={style.tableButton}>
                      <span className="icon">
                        <i className="fa fa-arrow-up fa-lg"></i>
                      </span>
                    </button>
                    <button className="button" disabled={item.displaySequence + 1 === item.tco} style={style.tableButton}>
                      <span className="icon">
                        <i className="fa fa-arrow-down fa-lg"></i>
                      </span>
                    </button>
                    <button className="button" disabled={item.childSeries.length > 0 || item.menuLevel === 1} style={style.tableButton}>
                      <span className="icon">
                        <i className="fa fa-arrow-right fa-lg"></i>
                      </span>
                    </button>
                    <button className="button" disabled={item.childSeries.length > 0} style={style.tableButton}>
                      <span className="icon has-text-danger">
                        <i className="fa fa-trash fa-lg"></i>
                      </span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

const style = {
  tableButton: {
    margin: '0px 3px 0 3px'
  },
  container: {
    padding: '10px'
  },
}

let data = [
  {
    "id": "6BA7AD31-D853-4E52-8372-2435CC1F162A",
    "name": "capacitor",
    "displaySequence": 0,
    "active": true,
    "menuLevel": 0,
    "parentSeriesId": null,
    "products": [
      {
        "id": "66A023CA-79C9-4ED1-A957-F088EE62F350",
        "code": "276-YFH12M",
        "active": true,
        "tags": [
          {
            "id": 11,
            "name": "New",
            "active": true,
            "labels": {
              "id": "3D2B3BA8-F011-43ED-921A-70AA746CC4CA",
              "productId": "66A023CA-79C9-4ED1-A957-F088EE62F350",
              "tagId": 11
            }
          },
          {
            "id": 15,
            "name": "accessories",
            "active": true,
            "labels": {
              "id": "3B4442C1-835C-43F7-A9A1-4A3D733167C7",
              "productId": "66A023CA-79C9-4ED1-A957-F088EE62F350",
              "tagId": 15
            }
          }
        ]
      },
      {
        "id": "A7A1483B-EA0A-40FC-882C-5C9663FEE101",
        "code": "863-YUSFII",
        "active": true,
        "tags": [
          {
            "id": 9,
            "name": "Extra Small",
            "active": true,
            "labels": {
              "id": "A5527312-D1A8-4D48-81ED-6616BFFE1C8C",
              "productId": "A7A1483B-EA0A-40FC-882C-5C9663FEE101",
              "tagId": 9
            }
          },
          {
            "id": 11,
            "name": "New",
            "active": true,
            "labels": {
              "id": "ACC8A878-7FB0-4EF0-8ADA-70617C1CAFD8",
              "productId": "A7A1483B-EA0A-40FC-882C-5C9663FEE101",
              "tagId": 11
            }
          }
        ]
      }
    ],
    "childSeries": [
      {
        "id": "09D57C07-6839-41E1-B7E9-A41D675C4603",
        "name": "application",
        "displaySequence": 0,
        "active": true,
        "menuLevel": 1,
        "parentSeriesId": "6BA7AD31-D853-4E52-8372-2435CC1F162A",
        "products": [
          {
            "id": "66A75F8D-E24E-409F-A4BA-4D9E63EFD846",
            "code": "351-VWRCA0",
            "active": true,
            "tags": []
          },
          {
            "id": "9D330AFA-FD54-4AC8-A87C-DE56729E52F7",
            "code": "737-HTADJA",
            "active": true,
            "tags": []
          }
        ],
        "childSeries": [],
        "tagMenus": []
      },
      {
        "id": "4F5098BB-5E4E-4225-9055-244E6017406E",
        "name": "card",
        "displaySequence": 1,
        "active": true,
        "menuLevel": 1,
        "parentSeriesId": "6BA7AD31-D853-4E52-8372-2435CC1F162A",
        "products": [
          {
            "id": "73950034-3F2A-4A66-B06F-D7FDEAB6ED47",
            "code": "420-Y3BJTY",
            "active": true,
            "tags": []
          },
          {
            "id": "9EB5EB63-8F8D-4544-9BB5-A009ABCBAE82",
            "code": "918-4KJ1RB",
            "active": true,
            "tags": []
          }
        ],
        "childSeries": [],
        "tagMenus": []
      }
    ],
    "tagMenus": [
      {
        "id": 11,
        "name": "New",
        "active": true,
        "labels": {
          "id": "3D2B3BA8-F011-43ED-921A-70AA746CC4CA",
          "productId": "66A023CA-79C9-4ED1-A957-F088EE62F350",
          "tagId": 11
        }
      }
    ]
  },
  {
    "id": "CA32AB9E-38EA-4369-9281-BD1E36E965AC",
    "name": "interface",
    "displaySequence": 1,
    "active": true,
    "menuLevel": 0,
    "parentSeriesId": null,
    "products": [
      {
        "id": "8832E728-8A09-459C-BC2C-BB7D728FE2C8",
        "code": "117-879A6I",
        "active": true,
        "tags": []
      },
      {
        "id": "1282BC55-A536-4D3D-AB8E-A5D50E0020EB",
        "code": "274-T2SYAL",
        "active": true,
        "tags": [
          {
            "id": 4,
            "name": "Budget",
            "active": true,
            "labels": {
              "id": "025CDB63-8261-42E9-8050-E084D0BB0059",
              "productId": "1282BC55-A536-4D3D-AB8E-A5D50E0020EB",
              "tagId": 4
            }
          },
          {
            "id": 3,
            "name": "Heavy Duty",
            "active": true,
            "labels": {
              "id": "3FB6A4D9-2C79-40DA-AEEE-0661FA37E2E1",
              "productId": "1282BC55-A536-4D3D-AB8E-A5D50E0020EB",
              "tagId": 3
            }
          },
          {
            "id": 15,
            "name": "accessories",
            "active": true,
            "labels": {
              "id": "39226FC1-D5E9-40DB-BA5C-CFCA483F086A",
              "productId": "1282BC55-A536-4D3D-AB8E-A5D50E0020EB",
              "tagId": 15
            }
          }
        ]
      },
      {
        "id": "6656773B-922A-4C44-AD1F-B6640A30A6A3",
        "code": "714-18FUUA",
        "active": true,
        "tags": []
      }
    ],
    "childSeries": [
      {
        "id": "7EC1DA04-654B-41B8-AE51-FF41A7B289C7",
        "name": "pixel",
        "displaySequence": 0,
        "active": true,
        "menuLevel": 1,
        "parentSeriesId": "CA32AB9E-38EA-4369-9281-BD1E36E965AC",
        "products": [
          {
            "id": "BCCDB6EC-7FB8-4E00-81DA-ED73C9CD30B5",
            "code": "175-7L5QW8",
            "active": true,
            "tags": []
          },
          {
            "id": "FAE4F126-FEE2-4033-86EC-007466FECBAD",
            "code": "472-DVV7C2",
            "active": true,
            "tags": []
          }
        ],
        "childSeries": [],
        "tagMenus": []
      }
    ],
    "tagMenus": [
      {
        "id": 4,
        "name": "Budget",
        "active": true,
        "labels": {
          "id": "025CDB63-8261-42E9-8050-E084D0BB0059",
          "productId": "1282BC55-A536-4D3D-AB8E-A5D50E0020EB",
          "tagId": 4
        }
      }
    ]
  },
  {
    "id": "C3DDA663-BF4C-4350-B3C5-537AF947A312",
    "name": "array",
    "displaySequence": 2,
    "active": true,
    "menuLevel": 0,
    "parentSeriesId": null,
    "products": [
      {
        "id": "FFF7DC00-08D3-45DB-900E-803381E97066",
        "code": "403-3LE6XL",
        "active": true,
        "tags": []
      },
      {
        "id": "3BCD7A9C-ACEE-434A-92F6-800EF966F0F6",
        "code": "440-CLNUC8",
        "active": true,
        "tags": []
      },
      {
        "id": "ED312ECE-BA11-456C-9C6F-148FD27300BA",
        "code": "509-7QQZSA",
        "active": true,
        "tags": []
      }
    ],
    "childSeries": [
      {
        "id": "583C196C-1BF4-4AF7-844D-A21CC105A484",
        "name": "microchip",
        "displaySequence": 0,
        "active": true,
        "menuLevel": 1,
        "parentSeriesId": "C3DDA663-BF4C-4350-B3C5-537AF947A312",
        "products": [
          {
            "id": "AA66CA53-AB1A-4679-9256-3B3848E24DDA",
            "code": "155-33P32X",
            "active": true,
            "tags": []
          },
          {
            "id": "207240E0-3AD5-42D3-9F8E-A9D23F5E7C50",
            "code": "661-B9OI9G",
            "active": true,
            "tags": [
              {
                "id": 13,
                "name": "Consumer Grade",
                "active": true,
                "labels": {
                  "id": "70D4DB9F-3047-43FA-AB53-14594506785D",
                  "productId": "207240E0-3AD5-42D3-9F8E-A9D23F5E7C50",
                  "tagId": 13
                }
              },
              {
                "id": 12,
                "name": "Hot Seller",
                "active": true,
                "labels": {
                  "id": "F7965084-0258-40E1-A409-786D27EEC6B4",
                  "productId": "207240E0-3AD5-42D3-9F8E-A9D23F5E7C50",
                  "tagId": 12
                }
              }
            ]
          }
        ],
        "childSeries": [],
        "tagMenus": [
          {
            "id": 13,
            "name": "Consumer Grade",
            "active": true,
            "labels": {
              "id": "70D4DB9F-3047-43FA-AB53-14594506785D",
              "productId": "207240E0-3AD5-42D3-9F8E-A9D23F5E7C50",
              "tagId": 13
            }
          }
        ]
      }
    ],
    "tagMenus": []
  }
]