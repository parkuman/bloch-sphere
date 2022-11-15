import * as math from 'mathjs';

export const X = math.matrix([
	[0, 1],
	[1, 0]
]);

export const Y = math.matrix([
	[0, math.complex(0, -1)],
	[math.complex(0, -1), 0]
]);

export const Z = math.matrix([
	[1, 0],
	[0, -1]
]);

export const H = math.matrix([
	[1 / Math.sqrt(2), 1 / Math.sqrt(2)],
	[1 / Math.sqrt(2), -1 / Math.sqrt(2)]
]);

export const S = math.matrix([
	[1, 0],
	[0, math.complex(0, -1)]
]);

export const St = math.matrix([
	[1, 0],
	[0, math.complex(0, -1)]
]);

export const T = math.matrix([
	[1, 0],
	[0, math.complex(1 / Math.sqrt(2), 1 / Math.sqrt(2))]
]);

export const Tt = math.matrix([
	[1, 0],
	[0, math.complex(1 / Math.sqrt(2), -1 / Math.sqrt(2))]
]);
