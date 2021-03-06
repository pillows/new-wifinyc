// Copyright (c) 2015 - 2017 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import {hexbin} from 'd3-hexbin';
import {createIterable, log} from '@deck.gl/core';

/**
 * Use d3-hexbin to performs hexagonal binning from geo points to hexagons
 * @param {Iterable} data - array of points
 * @param {Number} radius - hexagon radius in meter
 * @param {function} getPosition - get points lon lat
 * @param {Object} viewport - current viewport object

 * @return {Object} - hexagons and countRange
 */
export function pointToHexbin({data, radius, getPosition}, viewport) {
  // get hexagon radius in mercator world unit
  const radiusCommon = getRadiusInCommon(radius, viewport);

  // add world space coordinates to points
  const screenPoints = [];
  const {iterable, objectInfo} = createIterable(data);
  for (const object of iterable) {
    objectInfo.index++;
    const position = getPosition(object, objectInfo);
    const arrayIsFinite = Number.isFinite(position[0]) && Number.isFinite(position[1]);
    if (arrayIsFinite) {
      screenPoints.push(
        Object.assign(
          {
            screenCoord: viewport.projectFlat(position)
          },
          object
        )
      );
    } else {
      log.warn('HexagonLayer: invalid position')();
    }
  }

  const newHexbin = hexbin()
    .radius(radiusCommon)
    .x(d => d.screenCoord[0])
    .y(d => d.screenCoord[1]);

  const hexagonBins = newHexbin(screenPoints);

  return {
    hexagons: hexagonBins.map((hex, index) => ({
      position: viewport.unprojectFlat([hex.x, hex.y]),
      points: hex,
      index
    }))
  };
}

/**
 * Get radius in mercator world space coordinates from meter
 * @param {Number} radius - in meter
 * @param {Object} viewport - current viewport object

 * @return {Number} radius in mercator world spcae coordinates
 */
export function getRadiusInCommon(radius, viewport) {
  const {unitsPerMeter} = viewport.getDistanceScales();

  // x, y distance should be the same
  return radius * unitsPerMeter[0];
}
