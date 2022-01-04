import * as cdk from '@aws-cdk/core';
import {Tags} from "@aws-cdk/core";
import {SubnetType, Vpc} from "@aws-cdk/aws-ec2";

export class MorningcodeBasicCdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new Vpc(this, 'Vpc', {
      vpcName: 'morningcode-main-vpc',
      maxAzs: 2,
      cidr: '192.168.0.0/16',
      natGateways: 1,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'SubnetPub1',
          subnetType: SubnetType.PUBLIC,
        },
        {
          cidrMask: 24,
          name: 'SubnetPub2',
          subnetType: SubnetType.PUBLIC,
        },
        {
          cidrMask: 24,
          name: 'SubnetPri1',
          subnetType: SubnetType.PRIVATE_ISOLATED,
        },
        {
          cidrMask: 24,
          name: 'SubnetPri2',
          subnetType: SubnetType.PRIVATE_ISOLATED,
        },
      ]
    });

    Tags.of(this).add('ServiceName', 'morningcode');
  }
}
