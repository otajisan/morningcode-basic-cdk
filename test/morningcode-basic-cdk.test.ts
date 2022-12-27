import * as cdk from 'aws-cdk-lib';
import {Match, Template} from 'aws-cdk-lib/assertions';
import {MorningcodeBasicCdkStack} from "../lib/morningcode-basic-cdk-stack";

describe('correct resources are created', () => {
  const synthStack = () => {
    const app = new cdk.App();
    const env = {
      account: process.env.CDK_DEPLOY_ACCOUNT,
      region: process.env.CDK_DEPLOY_REGION,
    };
    return new MorningcodeBasicCdkStack(app, 'MorningcodeBasicCdkStack', {
      env,
    });
  };

  const getResourceIds = (type: string, props?: any): string[] =>
    Object.keys(Template.fromStack(synthStack()).findResources(type, props ? {Properties: props} : {}));

  const getResourceId = (type: string, props?: any): string => getResourceIds(type, props)[0];

  const vpcId = getResourceId('AWS::EC2::VPC');

  test('VPC is created', () => {
    const template = Template.fromStack(synthStack());

    const expectedTags = [
      {
        'Key': 'Name',
        'Value': 'morningcode-main-vpc',
      },
      {
        'Key': 'ServiceName',
        'Value': 'morningcode',
      }
    ];

    template.hasResourceProperties('AWS::EC2::VPC', {
      Tags: expectedTags
    })
  });

  test('Subnets are created', () => {
    const template = Template.fromStack(synthStack());

    template.resourceCountIs('AWS::EC2::Subnet', 4);
    template.hasResourceProperties('AWS::EC2::Subnet', {
      VpcId: { Ref: vpcId },
      AvailabilityZone: 'ap-northeast-1a',
      CidrBlock: Match.stringLikeRegexp('.*/24'),
    })
  });

  test('InternetGateways are created', () => {
    const template = Template.fromStack(synthStack());

    template.resourceCountIs('AWS::EC2::InternetGateway', 1);
  });

  test('Elastic IPs are created', () => {
    const template = Template.fromStack(synthStack());

    template.resourceCountIs('AWS::EC2::EIP', 1);
  });

  test('NAT Gateways are created', () => {
    const template = Template.fromStack(synthStack());

    template.resourceCountIs('AWS::EC2::NatGateway', 1);
  });
});