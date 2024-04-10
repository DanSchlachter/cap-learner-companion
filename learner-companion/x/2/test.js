const cds = require('@sap/cds/lib')
const exp = require('constants')
const { join } = require('path')
const project = join(__dirname, '../../../incidents-app')
const { expect } = cds.test(project)
const schema_cds = join(project, '/db/schema.cds')

describe('Test excercise 2', ()=>{
  it('phone numberclear', async ()=>{
    let csn = await cds.compile('file:' + schema_cds)
    let customers = csn.definitions.Customers.elements
    expect(customers.phone).to.eql({ type: 'cds.String' }, 'property phone is missing or wrong type')
    expect(Object.keys(customers).length).to.eql(4)
    })
  })

