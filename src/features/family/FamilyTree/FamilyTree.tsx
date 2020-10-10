import React, { useState } from 'react';
import { Grid } from 'semantic-ui-react';
import PinchZoomPan from 'pinch-zoom-pan';
import { IFamilyNode, IFamilyExtNode } from 'relatives-tree';
import ReactFamilyTree from 'react-family-tree';
import FamilyNode from '../../family/FamilyNode/FamilyNode';
import styles from '../FamilyTree/Family.module.css';
import nodes from '../../../app/api/family.json';

// const myID = 'dansandora';
const myID = 'CXFkyVOXxUTT8XL1dgRh';

const WIDTH = 70;
const HEIGHT = 110;
// @ts-ignore
export default function FamilyTree({ family }) {
  const modes = family;
  console.log('modes', modes);

  const [menuActive] = useState(false);
  const [rootId, setRootId] = useState<string>(myID);
  // const onResetClick = useCallback(() => setRootId(myID), []);

  console.log('family', family);
  console.log('json nodes', nodes);

  return (
    <Grid>
      <Grid.Column width={16}>
        <ul>
          {family.map((fam: any) => (
            <li className='fam' key={fam.id}>
              {fam.firstName} {fam.lastName}
              <br />
              {fam.id}
            </li>
          ))}
        </ul>
      </Grid.Column>
      <Grid.Column width={16}>
        <div className={styles.root}>
          <PinchZoomPan
            //debug
            captureWheel
            min={0.3}
            max={2.5}
            className={`myCanvas ${styles.wrapper} ${
              menuActive ? `${styles.ADDED_CLASS}` : ''
            }`}
          >
            <ReactFamilyTree
              nodes={nodes as IFamilyNode[]}
              rootId={rootId}
              width={WIDTH}
              height={HEIGHT}
              canvasClassName={styles.tree}
              renderNode={(node: IFamilyExtNode) => (
                <FamilyNode
                  key={node.id}
                  node={node}
                  isRoot={node.id === rootId}
                  onSubClick={setRootId}
                  style={{
                    top: '10px',
                    width: WIDTH,
                    height: HEIGHT,
                    transform: `translate(${node.left * (WIDTH / 2)}px, ${
                      node.top * (HEIGHT / 2)
                    }px)`,
                  }}
                />
              )}
            />
          </PinchZoomPan>
          {/* {rootId !== myID && (
          <div className={styles.reset} onClick={onResetClick}>Reset</div>
          )} */}
        </div>
      </Grid.Column>
    </Grid>
  );
}
