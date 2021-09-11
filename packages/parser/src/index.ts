import { Container } from 'typedi';
import { MockGenerator } from './lib/generator/mock-generator';
import { Faker } from '@mockinbird/common';
import RandExp from 'randexp';

export * from './lib/types/types';
export * from './lib/generator/mock-generator';

Container.set('Faker', Faker);
Container.set('RandExp', RandExp);

export const mockGenerator = Container.get(MockGenerator);
