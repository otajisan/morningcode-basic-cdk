#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { MorningcodeBasicCdkStack } from '../lib/morningcode-basic-cdk-stack';

const app = new cdk.App();
new MorningcodeBasicCdkStack(app, 'MorningcodeBasicCdkStack', {
  env: {
    region: 'ap-northeast-1',
  }
});

app.synth();