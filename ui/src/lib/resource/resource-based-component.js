import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { observable, action, computed, runInAction } from 'mobx'


class ResourceBasedComponent extends Component {
  static PropTypes = {
    resource: PropTypes.oneOf([
      PropTypes.string,
      PropTypes.object
    ]).isRequired,
    app: PropTypes.object.isRequired
  }
  
  constructor (props) {
    super(props)
    this.app = props.app
  }
  
  setDataContext( context ) {
    if (typeof theType === 'string') {
      dataContext = this.app.getResourceType(this.res).then((theType)=> (this.app.api.all(theType)))
    } else {
      dataContext = context
    }
  }
  
  @observable app
  @observable dataContext
  @observable working = false
  
  @observable data
  
  currentParams = {}
    
  @action.bound
  async fetchData(params) {
    this.working = true
    
    // Always merge so we remember all params set in various places.
    this.currentParams = Object.assign({}, this.currentParams, params)
    
    const remoteData = await this.dataContext.then((dataContext) => (dataContext.getAll(this.currentParams)))
    
    // The run in action ensures that the code within is executed after the await has finished, and within this context.
    runInAction(() => {
      this.data = remoteData
      this.working = false
    })
  }
}

export default ResourceBasedComponent
