process.env.CDS_TEST_SILENT='y'
const cds = require('@sap/cds/lib')
const { join } = require('path')
const project = join(__dirname, '../../../incidents-app')
const { expect } = cds.test(project)
const schema_cds = join(project, '/db/schema.cds')



describe('cds.compile.to.edmx tests', ()=>{
  it('should compile the model', async ()=>{
    let csn = await cds.compile('file:' + schema_cds)
    let customers = csn.definitions.Customers.elements
    expect(customers.ID).to.eql({ key: true, type: 'cds.UUID' }, 'Use aspect cuid')
    expect(customers.firstName).to.eql({ type: 'cds.String' }, 'property firstName is missing or wrong type')
    expect(customers.lastName).to.eql({ type: 'cds.String' }, 'property lastName is missing or wrong type')
    expect(Object.keys(customers).length).to.eql(3)
    })
  })

