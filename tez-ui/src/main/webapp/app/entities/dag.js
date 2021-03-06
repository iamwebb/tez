/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import Entity from './entity';

export default Entity.extend({
  queryRecord: function (loader, id, options, query, urlParams) {
    return this._super(loader, id, options, query, urlParams).then(function (dag) {
      if(dag.get("callerDescription") === undefined) {
        var dagName = dag.get("name") || "",
            hiveQueryID = dagName.substr(0, dagName.indexOf(":"));
        if(hiveQueryID && dagName !== hiveQueryID) {
          loader.queryRecord("hive-query", hiveQueryID, options, query, urlParams).then(function (hive) {
            dag.setProperties({
              callerContext: "Hive",
              callerDescription: hive.get("queryText")
            });
          });
        }
      }
      return dag;
    });
  }
});
