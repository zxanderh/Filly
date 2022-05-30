/* eslint-disable prefer-arrow-callback */
const chai = require('chai');
const filly = require('./index');

chai.should();

describe('Filly Tests', function() {

	const john = {
		firstName: 'Johnathan',
		lastName: 'Doe',
		nickname: '"John"',
		birthDate: '1970-12-1',
	};

	it('Basic fill', function() {
		const temp = filly('{firstName}-{nickname}-{lastName}-{birthDate}', john);
		temp.should.equal('Johnathan-"John"-Doe-1970-12-1');
	});

	context('Pipes', function() {
		it('Substr pipe', function() {
			const temp = filly('{birthDate|substr:5:2}/{birthDate|substr:8:1}/{birthDate|substr:0:4}', john);
			temp.should.equal('12/1/1970');
		});
		it('Slice pipe', function() {
			const temp = filly('{nickname|slice:1:-1}', john);
			temp.should.equal('John');
		});
		it('Custom pipe', function() {
			const temp = filly('{firstName|lower}', john, {
				pipes: { lower: (val) => val.toLowerCase() },
			});
			temp.should.equal('johnathan');
		});
		it('Pipe input value accurate', function() {
			filly('{firstName|test}', john, {
				pipes: {
					test: (val) => {
						val.should.equal('Johnathan');
					},
				},
			});
		});
		it('Pipe params accurate', function() {
			filly('{firstName|test:foo:bar:blah}', john, {
				pipes: {
					test: (val, ...params) => {
						params.should.have.all.ordered.members(['foo', 'bar', 'blah']);
					},
				},
			});
		});
	});

	context('Transform', function() {
		it('Basic Transform', function() {
			const temp = filly('{firstName}', john, {
				transform: (val) => val.toUpperCase(),
			});
			temp.should.equal('JOHNATHAN');
		});
		it('Transform info.key accurate', function() {
			let i = 0;
			filly('{firstName|substr:0:1}-{{lastName|slice:1:-1}}', john, {
				transform: (val, info) => {
					if (i++ === 0) {
						info.key.should.equal('firstName');
					} else {
						info.key.should.equal('lastName');
					}
				},
			});
		});
		it('Transform info.pipe accurate', function() {
			let i = 0;
			filly('{firstName|substr:0:1}-{{lastName|slice:1:-1}}', john, {
				transform: (val, info) => {
					if (i++ === 0) {
						info.pipe.should.equal('substr');
					} else {
						info.pipe.should.equal('slice');
					}
				},
			});
		});
		it('Transform info.params accurate', function() {
			let i = 0;
			filly('{firstName|substr:0:1}-{{lastName|slice:1:-1}}', john, {
				transform: (val, info) => {
					if (i++ === 0) {
						info.params.should.have.all.ordered.members(['0', '1']);
					} else {
						info.params.should.have.all.ordered.members(['1', '-1']);
					}
				},
			});
		});
		it('Transform info.depth accurate', function() {
			let i = 0;
			filly('{firstName|substr:0:1}-{{lastName|slice:1:-1}}', john, {
				transform: (val, info) => {
					if (i++ === 0) {
						info.depth.should.equal(1);
					} else {
						info.depth.should.equal(2);
					}
				},
			});
		});
		it('Transform info.depth accurate (asymmetric brackets)', function() {
			let i = 0;
			filly('{firstName|substr:0:1}}-{{{lastName|slice:1:-1}}', john, {
				transform: (val, info) => {
					if (i++ === 0) {
						info.depth.should.equal(1);
					} else {
						info.depth.should.equal(2);
					}
				},
			});
		});
	});

	context('NotFoundValue', function() {
		it('Static notFoundValue', function() {
			const temp = filly('{foo}-{firstName}-{bar}', john, { notFoundValue: 'missing' });
			temp.should.equal('missing-Johnathan-missing');
		});
		it('Callback notFoundValue', function() {
			const temp = filly('{foo}-{firstName}-{bar}', john, { notFoundValue: (key) => 'missing' + key });
			temp.should.equal('missingfoo-Johnathan-missingbar');
		});
	});
});
