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

var urljoin = require('url-join');
var util = require('util');
var utility = require('./utility');
var extend = require('extend');

var mbedConnectorApi = require('./common');


/**
 * GETs the status of a resource's subscription
 * @param {string} endpoint - The name of the endpoint
 * @param {string} resource - The path to the resource
 * @param {Object} [options] - Optional options object
 * @param {function} [callback] - A function that is passed
 * `(error, subscribed)` where
 * `subscribed` is `true` or `false`
 */

mbedConnectorApi.prototype.getResourceSubscription = function(endpoint,
                                                           resource,
                                                           options,
                                                           callback) {
  options = extend(true, {}, this.options, options || {});

  var requestData = {
    method: 'GET',
    url: urljoin(options.host,
                 options.restApiVersion,
                 'subscriptions',
                 endpoint,
                 resource)
  };

  this.makeRequest(requestData, function(error, data) {
    if (typeof callback === 'function') {
      if (error) {
        if (error.status === 404) {
          // Not subscribed
          callback(null, false);
        } else {
          callback(error);
        }
      } else {
        // if no error code returned, return true for 'subscribed'
        callback(null, true);
      }
    }
  }, options);
};


/**
 * PUTs a subscription to a resource
 * @param {string} endpoint - The name of the endpoint
 * @param {string} resource - The path to the resource
 * @param {function} [callback] - A function that is passed a potential `error`
 * object
 * @param {Object} [options] - Optional options object
 */

mbedConnectorApi.prototype.putResourceSubscription = function(endpoint,
                                                           resource,
                                                           options,
                                                           callback) {
  options = extend(true, {}, this.options, options || {});

  var requestData = {
    method: 'PUT',
    url: urljoin(options.host,
                 options.restApiVersion,
                 'subscriptions',
                 endpoint,
                 resource),
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


/**
 * DELETEs a resource's subscription
 * @param {string} endpoint - The name of the endpoint
 * @param {string} resource - The path to the resource
 * @param {Object} [options] - Optional options object
 * @param {function} [callback] - A function that is passed a potential `error`
 * object
 */

mbedConnectorApi.prototype.deleteResourceSubscription = function(endpoint,
                                                              resource,
                                                              options,
                                                              callback) {
  options = extend(true, {}, this.options, options || {});

  var requestData = {
    method: 'DELETE',
    url: urljoin(options.host,
                 options.restApiVersion,
                 'subscriptions',
                 endpoint,
                 resource),
    headers: {
      accept: 'application/json'
    }
  };

  this.makeRequest(requestData, function(error, data) {
    if (typeof callback === 'function') {
      if (error && error.status !== 404) {
        // Subscription not found
        callback(error);
      } else {
        // No current subscription or subscription successfully deleted
        callback();
      }
    }
  }, options);
};


/**
 * Gets a list of an endpoint's subscriptions
 * @param {string} endpoint - The name of the endpoint
 * @param {Object} [options] - Optional options object
 * @param {function} [callback] - A function that is passed
 * `(error, subscriptions)`
 */

mbedConnectorApi.prototype.getEndpointSubscriptions = function(endpoint,
                                                            options,
                                                            callback) {
  options = extend(true, {}, this.options, options || {});

  var requestData = {
    method: 'GET',
    url: urljoin(options.host,
                 options.restApiVersion,
                 'subscriptions',
                 endpoint),
    headers: {
      accept: 'text/uri-list'
    }
  };

  this.makeRequest(requestData, function(error, data) {
    if (typeof callback === 'function') {
      if (error) {
        if (error.status === 404) {
          // Handle if no subscriptions exist for an endpoint
          callback(null, []);
        } else {
          callback(error);
        }
      } else {
        // Trim the last newline character from the uri-list
        var uriListString = data.payload.replace(/\n$/, '');
        callback(null, uriListString.split(/\n/));
      }
    }
  }, options);
};


/**
 * Removes an endpoint's subscriptions
 * @param {string} endpoint - The name of the endpoint
 * @param {Object} [options] - Optional options object
 * @param {function} [callback] - A function that is passed a potential `error`
 * object
 */

mbedConnectorApi.prototype.deleteEndpointSubscriptions = function(endpoint,
                                                               options,
                                                               callback) {
  options = extend(true, {}, this.options, options || {});

  var requestData = {
    method: 'DELETE',
    url: urljoin(options.host,
                 options.restApiVersion,
                 'subscriptions',
                 endpoint),
    headers: {
      accept: 'application/json'
    }
  };

  this.makeRequest(requestData, function(error, data) {
    if (typeof callback === 'function') {
      if (error) {
        if (error.status === 404) {
          // No current subscriptions
          callback(null, false);
        } else {
          callback(error);
        }
      } else {
        callback(null);
      }
    }
  }, options);
};


/**
 * Removes all subscriptions
 * @param {function} [callback] - A function that is passed a potential `error`
 * object
 */

mbedConnectorApi.prototype.deleteAllSubscriptions = function(options, callback) {
  options = extend(true, {}, this.options, options || {});

  var requestData = {
    method: 'DELETE',
    url: urljoin(options.host, options.restApiVersion, 'subscriptions'),
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


/**
 * GETs pre-subscription data
 * @param {Object} [options] - Optional options object
 * @param {function} [callback] - A function that is passed `(error, data)`
 */

mbedConnectorApi.prototype.getPreSubscription = function(options, callback) {
  options = extend(true, {}, this.options, options || {});

  var requestData = {
    method: 'GET',
    url: urljoin(options.host, options.restApiVersion, 'subscriptions'),
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
 * PUTs pre-subscription data
 * @param {Object} data - The pre-subscription data
 * @param {Object} [options] - Optional options object
 * @param {function} [callback] - A function that is passed a potential `error`
 * object
 */

mbedConnectorApi.prototype.putPreSubscription = function(data, options, callback) {
  options = extend(true, {}, this.options, options || {});

  var requestData = {
    method: 'PUT',
    url: urljoin(options.host, options.restApiVersion, 'subscriptions'),
    json: data
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
