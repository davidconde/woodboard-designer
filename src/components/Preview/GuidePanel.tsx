import styles from './GuidePanel.module.css';

export function GuidePanel() {
  return (
    <div className={styles.container}>
      <section className={styles.section}>
        <h3 className={styles.heading}>Getting Started</h3>
        <p>
          Board Maker lets you design custom cutting boards by arranging strips
          of different wood species side by side. Pick your woods, set your strip
          widths, and see a real-time 3D preview of the finished board.
        </p>
        <ol className={styles.steps}>
          <li>Choose a wood type from the <strong>Wood Types</strong> palette</li>
          <li>Click <strong>+ Add Strip</strong> to add it to your board</li>
          <li>Adjust the width of each strip and reorder as needed</li>
          <li>Rotate the 3D preview to inspect your design from any angle</li>
        </ol>
      </section>

      <section className={styles.section}>
        <h3 className={styles.heading}>Settings</h3>
        <dl className={styles.defList}>
          <dt>Units (cm / in)</dt>
          <dd>
            Toggle between metric and imperial. All values convert automatically
            &mdash; the board dimensions are stored internally in centimeters.
          </dd>

          <dt>Board Type (Edge Grain / End Grain)</dt>
          <dd>
            <strong>Edge grain</strong> is the simpler construction: strips are
            glued side by side with the long grain facing up. This is the most
            common style for beginners.
          </dd>
          <dd>
            <strong>End grain</strong> adds extra steps: after gluing the strips
            into an edge grain slab, the slab is crosscut into slices (each as
            thick as the Board Thickness setting), then those slices are flipped
            90&deg; and re-glued with the end grain facing up. End grain boards
            are more durable and self-healing for knife edges.
          </dd>

          <dt>Rotate layers on end grain</dt>
          <dd>
            Only available in End Grain mode. When enabled, every other slice is
            reversed before re-gluing, creating a checkerboard-like pattern
            where the strip order alternates row by row.
          </dd>

          <dt>Board Height</dt>
          <dd>
            The length of the initial edge grain slab (before any crosscuts).
            For edge grain boards this is the final board length. For end grain
            boards this determines how many slices you can cut.
          </dd>

          <dt>Board Thickness</dt>
          <dd>
            The thickness of the finished board. For end grain boards this also
            controls the width of each crosscut slice &mdash; a thicker board
            means fewer but wider slices.
          </dd>

          <dt>Blade Kerf</dt>
          <dd>
            The width of material removed by each saw cut (typically 2&ndash;3mm
            for a standard table saw blade). This affects material calculations
            and the number of end grain slices you can get from a slab.
          </dd>
        </dl>
      </section>

      <section className={styles.section}>
        <h3 className={styles.heading}>Strips</h3>
        <p>
          Each strip represents one piece of wood in your board. For each strip
          you can set:
        </p>
        <ul className={styles.list}>
          <li><strong>Wood type</strong> &mdash; select from the dropdown or click a swatch in the palette first</li>
          <li><strong>Width</strong> &mdash; how wide this strip is (in your chosen units)</li>
          <li><strong>Order</strong> &mdash; use the arrow buttons to move a strip left or right</li>
          <li><strong>Delete</strong> &mdash; remove a strip with the &times; button</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h3 className={styles.heading}>3D Preview</h3>
        <p>
          The Preview tab shows a 3D rendering of your cutting board with
          realistic wood textures. Edge grain and end grain boards use
          different textures to reflect how the wood actually looks from each
          face.
        </p>
        <ul className={styles.list}>
          <li><strong>Rotate</strong> &mdash; click and drag</li>
          <li><strong>Zoom</strong> &mdash; scroll wheel</li>
          <li><strong>Pan</strong> &mdash; right-click and drag</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h3 className={styles.heading}>Calculations</h3>
        <p>
          The Calculations tab shows how much wood you need to buy and how
          much will be lost to saw cuts.
        </p>
        <dl className={styles.defList}>
          <dt>Rip Cuts</dt>
          <dd>
            These are the lengthwise cuts to create your strips. For each wood
            type, the calculator shows how many strips you need, how many cuts
            that requires (strips &minus; 1), the total linear material, and the
            kerf waste from those cuts.
          </dd>

          <dt>Crosscuts (end grain only)</dt>
          <dd>
            After gluing the edge grain slab, you crosscut it into slices. Each
            crosscut removes a kerf-width of material across the full board
            width. The calculator shows the number of slices, crosscuts, and
            total crosscut waste.
          </dd>

          <dt>Total Waste</dt>
          <dd>
            The combined kerf waste from both rip cuts and crosscuts. This is
            material you&rsquo;ll lose to saw dust &mdash; plan your lumber
            purchases accordingly.
          </dd>
        </dl>
      </section>

      <section className={styles.section}>
        <h3 className={styles.heading}>Wood Types</h3>
        <p>
          The app includes 10 common hardwoods used in cutting board making:
        </p>
        <ul className={styles.woodList}>
          <li><strong>Cherry</strong> &mdash; warm reddish-brown, fine even grain</li>
          <li><strong>Red Oak</strong> &mdash; golden-tan, prominent open grain with visible rays</li>
          <li><strong>Maple</strong> &mdash; pale cream, very tight subtle grain</li>
          <li><strong>Walnut</strong> &mdash; deep chocolate brown, moderate flowing grain</li>
          <li><strong>Ebony</strong> &mdash; near-black, extremely fine grain</li>
          <li><strong>Padauk</strong> &mdash; vivid orange-red, medium grain</li>
          <li><strong>Purpleheart</strong> &mdash; deep purple, fine straight grain</li>
          <li><strong>Mahogany</strong> &mdash; medium reddish-brown, interlocked grain</li>
          <li><strong>Ash</strong> &mdash; pale tan, bold open grain</li>
          <li><strong>Zebrawood</strong> &mdash; dramatic alternating light and dark stripes</li>
        </ul>
      </section>
    </div>
  );
}
