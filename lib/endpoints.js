/*
 * Copyright (c) 2013-2016, ARM Limited, All Rights Reserved
 * SPDX-License-Identifier: Apache-2.0
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var request = require('request');
var urljoin = require('url-join');
var events = require('events');
var util = require('util');
var extend = require('extend');

var mbedConnectorApi = require('./common');


/**
 * Gets a list of currently registered endpoints
 * @param {Object} [options] - Optional options object
 * @param {string} [options.parameters.type] - Filters endpoints by
 * endpoint-type
 * @param {function} [callback] - A function that is passed the arguments
 * `(error, endpoints)`
 */

mbedConnectorApi.prototype.getEndpoints = function(options, callback) {
  if (typeof options === 'string') {
    options = { parameters: { type: options } };
  }

  options = extend(true, {}, this.options, options || {});

  var requestData = {
    method: 'GET',
    url: urljoin(options.host, options.restApiVersion, 'endpoints'),
    headers: {
      accept: 'application/json'
    }
  };

  if (options.parameters) {
    requestData.qs = options.parameters;
  }

  this.makeRequest(requestData, function(error, data) {
    if (typeof callback === 'function') {
      if (error) {
        callback(error);
      } else {
        callback(null, JSON.parse(data.payload));
      }
    }
  }, options);
};


/**
 * Gets a list of an endpoint's resources
 * @param {string} endpoint - The name of the endpoint
 * @param {Object} [options] - Optional options object
 * @param {function} [callback] - A function that is passed the arguments
 * `(error, resources)`
 */

mbedConnectorApi.prototype.getResources = function(endpoint, options, callback) {
  if (typeof endpoint === 'object' && endpoint.name) endpoint = endpoint.name;

  options = extend(true, {}, this.options, options || {});

  var requestData = {
    method: 'GET',
    url: urljoin(options.host, options.restApiVersion, 'endpoints', endpoint),
    headers: {
      accept: 'application/json'
    }
  };

  this.makeRequest(requestData, function(error, data) {
    if (typeof callback === 'function') {
      if (error) {
        callback(error);
      } else {
        callback(null, JSON.parse(data.payload));
      }
    }
  }, options);
};


/**
 * GETs the value of an endpoint's resource
 * @param {string} endpoint - The name of the endpoint
 * @param {string} resource - The path to the resource
 * @param {Object} [options] - Optional options object
 * @param {boolean} [options.parameters.cacheOnly=false] - If `true`, the
 * response will come only from the cache
 * @param {boolean} [options.parameters.noResp=false] - If `true`, mbed Device
 * Connector will not wait for a response. Creates a CoAP Non-Confirmable
 * requests. If `false`, a response is expected and the CoAP request is
 * confirmable.
 * @param {function} [callback] - A function that is passed the arguments
 * `(error, value)`
 * where `value` is the value of the resource formatted as a string.
 */

mbedConnectorApi.prototype.getResourceValue = function(endpoint,
                                                    resource,
                                                    options,
                                                    callback) {
  if (typeof endpoint === 'object' && endpoint.name) endpoint = endpoint.name;

  options = extend(true, {}, this.options, options || {});

  var requestData = {
    method: 'GET',
    url: urljoin(options.host,
                      options.restApiVersion,
                      'endpoints',
                      endpoint,
                      resource),
    qs: options.parameters,
    headers: {
      accept: '*/*'
    }
  };

  this.makeRequest(requestData, function(error, data) {
    if (typeof callback === 'function') {
      if (error) {
        callback(error);
      } else {
        callback(null, data.payload);
      }
    }
  }, options);
};

/**
 * PUTs a value of an endpoint's resource
 * @param {string} endpoint - The name of the endpoint
 * @param {string} resource - The path to the resource
 * @param {string} value - The value of the resource
 * @param {Object} [options] - Optional options object
 * @param {boolean} [options.parameters.cacheOnly=false] - If `true`, the
 * response will come only from the cache
 * @param {boolean} [options.parameters.noResp=false] - If `true`, mbed Device
 * Connector will not wait for a response. Creates a CoAP Non-Confirmable
 * requests. If `false`, a response is expected and the CoAP request is
 * confirmable.
 * @param {function} [callback] - A function that is passed a potential `error`
 * object
 */

mbedConnectorApi.prototype.putResourceValue = function(endpoint,
                                                    resource,
                                                    value,
                                                    options,
                                                    callback) {
  if (typeof endpoint === 'object' && endpoint.name) endpoint = endpoint.name;

  options = extend(true, {}, this.options, options || {});

  var requestData = {
    method: 'PUT',
    url: urljoin(options.host,
                      options.restApiVersion,
                      'endpoints',
                      endpoint,
                      resource),
    qs: options.parameters,
    headers: {
      accept: 'application/json'
    },
    body: value.toString()
  };

  this.makeRequest(requestData, function(error, data) {
    if (typeof callback === 'function') {
      if (error) {
        callback(error);
      } else {
        callback(null);
      }
    }
  }, options);
};


/**
 * POSTs a value of an endpoint's resource
 * @param {string} endpoint - The name of the endpoint
 * @param {string} resource - The path to the resource
 * @param {string} value - The value of the resource (can be `null`)
 * @param {Object} [options] - Optional options object
 * @param {boolean} [options.parameters.cacheOnly=false] - If `true`, the
 * response will come only from the cache
 * @param {boolean} [options.parameters.noResp=false] - If `true`, mbed Device
 * Connector will not wait for a response. Creates a CoAP Non-Confirmable
 * requests. If `false`, a response is expected and the CoAP request is
 * confirmable.
 * @param {function} [callback] - A function that is passed a potential `error`
 * object
 */

mbedConnectorApi.prototype.postResource = function(endpoint,
                                                resource,
                                                value,
                                                options,
                                                callback) {
  if (typeof endpoint === 'object' && endpoint.name) endpoint = endpoint.name;

  options = extend(true, {}, this.options, options || {});

  var requestData = {
    method: 'POST',
    url: urljoin(options.host,
                      options.restApiVersion,
                      'endpoints',
                      endpoint,
                      resource),
    qs: options.parameters,
    headers: {
      accept: 'application/json'
    }
  };

  if (value) {
    requestData.body = value.toString();
  }

  this.makeRequest(requestData, function(error, data) {
    if (typeof callback === 'function') {
      if (error) {
        callback(error);
      } else {
        callback(null);
      }
    }
  }, options);
};


/**
 * DELETEs an endpoint
 * @param {string} endpoint - The name of the endpoint
 * @param {Object} [options] - Optional options object
 * @param {boolean} [options.parameters.cacheOnly=false] - If `true`, the
 * response will come only from the cache
 * @param {boolean} [options.parameters.noResp=false] - If `true`, mbed Device
 * Connector will not wait for a response. Creates a CoAP Non-Confirmable
 * requests. If `false`, a response is expected and the CoAP request is
 * confirmable.
 * @param {function} [callback] - A function that is passed a potential `error`
 * object
 */

mbedConnectorApi.prototype.deleteEndpoint = function(endpoint, options, callback) {
  if (typeof endpoint === 'object' && endpoint.name) endpoint = endpoint.name;

  options = extend(true, {}, this.options, options || {});

  var requestData = {
    method: 'DELETE',
    url: urljoin(options.host, options.restApiVersion, 'endpoints', endpoint),
    qs: options.parameters,
    headers: {
      accept: 'application/json'
    }
  };

  this.makeRequest(requestData, function(error, data) {
    if (typeof callback === 'function') {
      if (error) {
        callback(error);
      } else {
        callback(null);
      }
    }
  }, options);
};
